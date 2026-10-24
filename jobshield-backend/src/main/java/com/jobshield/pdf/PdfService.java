package com.jobshield.pdf;

import org.springframework.web.multipart.MultipartFile;
import com.jobshield.jobs.entity.JobAnalysis;

public interface PdfService {

    String extractText(MultipartFile file);

    byte[] generateAuditReport(JobAnalysis analysis);
}