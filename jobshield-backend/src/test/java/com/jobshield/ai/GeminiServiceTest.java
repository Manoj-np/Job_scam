package com.jobshield.ai;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;

import com.jobshield.ai.dto.AiAnalysisResult;

class GeminiServiceTest {

    private GeminiServiceImpl geminiService;

    @BeforeEach
    void setUp() {
        RestClient restClient = RestClient.builder().build();
        geminiService = new GeminiServiceImpl(restClient);
        ReflectionTestUtils.setField(geminiService, "apiKey", "test-api-key");
    }

    @Test
    @DisplayName("Heuristic fallback should flag upfront fee and Telegram scam keywords as HIGH risk")
    void testAnalyzeJob_HeuristicFallback_HighRisk() {
        String scamJob = "Work from home data entry. Pay is $5000/week with no interview! "
                + "Contact on Telegram: @quick_hire. Send a registration fee of $50 for onboarding equipment.";

        AiAnalysisResult result = geminiService.analyzeJob(scamJob);

        assertNotNull(result);
        assertTrue(result.getRiskScore() >= 65, "Expected high risk score for obvious scam triggers");
        assertEquals("HIGH", result.getRiskLevel());
        assertTrue(result.getReason().contains("Heuristic Engine"));
        assertTrue(result.getReason().contains("upfront fees"));
    }

    @Test
    @DisplayName("Heuristic fallback should evaluate legitimate job posting as LOW risk")
    void testAnalyzeJob_HeuristicFallback_LowRisk() {
        String legitimateJob = "Software Engineer at Tech Corp. Requirements: 3+ years experience with Java, Spring Boot, and MySQL. "
                + "Apply via our corporate career portal at careers@techcorp.com. Comprehensive benefits and 401(k) match included.";

        AiAnalysisResult result = geminiService.analyzeJob(legitimateJob);

        assertNotNull(result);
        assertTrue(result.getRiskScore() < 35, "Expected low risk score for corporate listing");
        assertEquals("LOW", result.getRiskLevel());
    }
}
