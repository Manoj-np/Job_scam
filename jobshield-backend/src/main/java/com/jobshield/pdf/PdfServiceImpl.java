package com.jobshield.pdf;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jobshield.jobs.entity.JobAnalysis;

@Service
public class PdfServiceImpl implements PdfService {

    @Override
    public String extractText(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("PDF file is required and cannot be empty");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Unable to read PDF: " + e.getMessage());
        }
    }

    @Override
    public byte[] generateAuditReport(JobAnalysis analysis) {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream stream = new PDPageContentStream(document, page)) {
                // Header Banner
                stream.setNonStrokingColor(15, 23, 42); // #0f172a
                stream.addRect(40, 720, 532, 60);
                stream.fill();

                // Banner Text
                stream.setNonStrokingColor(255, 255, 255);
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
                stream.newLineAtOffset(55, 745);
                stream.showText("JOBSHIELD - SECURITY AUDIT REPORT");
                stream.endText();

                // Metadata Section
                stream.setNonStrokingColor(30, 41, 59);
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                stream.newLineAtOffset(55, 690);
                stream.showText("Audit Reference: #" + analysis.getAnalysisId());
                stream.newLineAtOffset(0, -20);
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
                stream.showText("Company Name: " + (analysis.getCompanyName() != null ? sanitizeText(analysis.getCompanyName()) : "N/A"));
                stream.newLineAtOffset(0, -18);
                stream.showText("Job Title: " + (analysis.getJobTitle() != null ? sanitizeText(analysis.getJobTitle()) : "N/A"));
                stream.newLineAtOffset(0, -18);
                stream.showText("Scan Timestamp: " + (analysis.getCreatedAt() != null ? analysis.getCreatedAt().toString() : "Recent"));
                stream.endText();

                // Risk Score Highlight Box
                int score = analysis.getRiskScore() != null ? analysis.getRiskScore() : 0;
                String level = analysis.getRiskLevel() != null ? analysis.getRiskLevel().toUpperCase() : "UNKNOWN";

                if ("HIGH".equals(level)) {
                    stream.setNonStrokingColor(239, 68, 68);
                } else if ("MEDIUM".equals(level)) {
                    stream.setNonStrokingColor(245, 158, 11);
                } else {
                    stream.setNonStrokingColor(16, 185, 129);
                }
                stream.addRect(55, 545, 500, 45);
                stream.fill();

                stream.setNonStrokingColor(255, 255, 255);
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                stream.newLineAtOffset(70, 562);
                stream.showText("FRAUD RISK ASSESSMENT: " + score + "/100 (" + level + " RISK)");
                stream.endText();

                // AI Findings Header
                stream.setNonStrokingColor(15, 23, 42);
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                stream.newLineAtOffset(55, 515);
                stream.showText("AI Threat Intelligence Findings:");
                stream.endText();

                // AI Reason Text (word-wrapped)
                String reason = analysis.getAiReason() != null ? sanitizeText(analysis.getAiReason()) : "No specific deception flags recorded.";
                writeWrappedText(stream, reason, 55, 490, 80);

                // Safe Application Guidelines
                stream.setNonStrokingColor(15, 23, 42);
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                stream.newLineAtOffset(55, 340);
                stream.showText("Job Hunting Verification Checklist:");
                stream.endText();

                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                stream.newLineAtOffset(55, 315);
                stream.showText("[*] Never transfer funds or purchase office equipment before starting.");
                stream.newLineAtOffset(0, -16);
                stream.showText("[*] Verify recruiter identity directly on the official company careers page.");
                stream.newLineAtOffset(0, -16);
                stream.showText("[*] Beware of interviews conducted exclusively via Telegram, WhatsApp, or SMS.");
                stream.newLineAtOffset(0, -16);
                stream.showText("[*] Legitimate employers never ask for banking passwords or cryptocurrency deposits.");
                stream.endText();

                // Footer
                stream.setNonStrokingColor(148, 163, 184);
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 9);
                stream.newLineAtOffset(55, 60);
                stream.showText("Generated by JobShield AI Fraud Detection Platform - Automated Verification Certificate");
                stream.endText();
            }

            document.save(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF audit report: " + e.getMessage(), e);
        }
    }

    private String sanitizeText(String text) {
        if (text == null) return "";
        return text.replaceAll("[\\r\\n]+", " ").replaceAll("[^\\x20-\\x7E]", " ").trim();
    }

    private void writeWrappedText(PDPageContentStream stream, String text, float x, float y, int maxCharsPerLine) throws IOException {
        String[] words = text.split("\\s+");
        StringBuilder line = new StringBuilder();
        float currentY = y;

        stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
        stream.setNonStrokingColor(51, 65, 85);

        for (String word : words) {
            if (line.length() + word.length() + 1 > maxCharsPerLine) {
                stream.beginText();
                stream.newLineAtOffset(x, currentY);
                stream.showText(line.toString());
                stream.endText();
                currentY -= 15;
                line = new StringBuilder();
                if (currentY < 360) break;
            }
            if (line.length() > 0) line.append(" ");
            line.append(word);
        }
        if (line.length() > 0 && currentY >= 360) {
            stream.beginText();
            stream.newLineAtOffset(x, currentY);
            stream.showText(line.toString());
            stream.endText();
        }
    }
}