package com.jobshield.pdf;

import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

class PdfServiceTest {

    private PdfService pdfService;

    @BeforeEach
    void setUp() {
        pdfService = new PdfServiceImpl();
    }

    @Test
    @DisplayName("Should extract text successfully from a valid PDF document")
    void testExtractText_ValidPdf() throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream stream = new PDPageContentStream(document, page)) {
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                stream.newLineAtOffset(100, 700);
                stream.showText("Job Offer Letter - Confidential");
                stream.endText();
            }
            document.save(out);
        }

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "offer.pdf",
                "application/pdf",
                out.toByteArray()
        );

        String extracted = pdfService.extractText(file);

        assertNotNull(extracted);
        assertTrue(extracted.contains("Job Offer Letter - Confidential"));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when file is null or empty")
    void testExtractText_EmptyFile() {
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "empty.pdf",
                "application/pdf",
                new byte[0]
        );

        assertThrows(IllegalArgumentException.class, () -> {
            pdfService.extractText(emptyFile);
        });
    }
}
