package com.jobshield.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.jobshield.ai.dto.AiAnalysisResult;
import com.jobshield.ai.dto.GeminiResponse;

@Service
public class GeminiServiceImpl implements GeminiService {

    private final RestClient restClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiServiceImpl(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public AiAnalysisResult analyzeJob(String jobDescription) {

        String prompt = """
                Analyze the following job posting for scam indicators.

                Return ONLY in this format:

                Risk Score: <0-100>
                Risk Level: LOW, MEDIUM or HIGH
                Reason: <short explanation>

                Job Description:
                """ + jobDescription;

        String requestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": %s
                        }
                      ]
                    }
                  ]
                }
                """.formatted("\"" + prompt.replace("\"", "\\\"") + "\"");

        try {
            GeminiResponse response = restClient.post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                String aiText = response.getCandidates()
                        .get(0)
                        .getContent()
                        .getParts()
                        .get(0)
                        .getText();

                return parseResponse(aiText);
            }
        } catch (Exception ex) {
            System.err.println("Gemini API call failed, falling back to heuristic engine: " + ex.getMessage());
        }

        return heuristicFallback(jobDescription);
    }

    private AiAnalysisResult heuristicFallback(String jobDescription) {
        String lower = jobDescription.toLowerCase();
        int score = 10;
        StringBuilder reasons = new StringBuilder("[Heuristic Engine] ");

        if (lower.contains("registration fee") || lower.contains("upfront payment") || lower.contains("processing fee")
                || lower.contains("send money") || lower.contains("check deposit") || lower.contains("buy equipment")) {
            score += 55;
            reasons.append("Requests upfront fees, check deposits, or equipment payments. ");
        }

        if (lower.contains("telegram") || lower.contains("whatsapp only") || lower.contains("signal")
                || lower.contains("@gmail.com") || lower.contains("@yahoo.com") || lower.contains("@hotmail.com")) {
            score += 25;
            reasons.append("Directs applicant to unofficial communication channels or personal webmail domains. ");
        }

        if (lower.contains("no interview") || lower.contains("immediate hiring") || lower.contains("no experience needed $")
                || lower.contains("$5000/week") || lower.contains("$1000/day")) {
            score += 20;
            reasons.append("Suspiciously high compensation or promises immediate hiring without interview verification. ");
        }

        score = Math.min(score, 100);
        String level = score >= 65 ? "HIGH" : (score >= 35 ? "MEDIUM" : "LOW");
        if (reasons.toString().equals("[Heuristic Engine] ")) {
            reasons.append("Standard job description syntax. No prominent scam patterns identified.");
        }

        return new AiAnalysisResult(score, level, reasons.toString().trim());
    }

    private AiAnalysisResult parseResponse(String text) {

        int riskScore = 0;
        String riskLevel = "";
        String reason = "";

        String[] lines = text.split("\\n");

        for (String line : lines) {

            if (line.startsWith("Risk Score:")) {
                riskScore = Integer.parseInt(
                        line.replace("Risk Score:", "").trim());
            } else if (line.startsWith("Risk Level:")) {
                riskLevel = line.replace("Risk Level:", "").trim();
            } else if (line.startsWith("Reason:")) {
                reason = line.replace("Reason:", "").trim();
            }
        }

        return new AiAnalysisResult(
                riskScore,
                riskLevel,
                reason
        );
    }
}