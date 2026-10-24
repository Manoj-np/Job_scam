package com.jobshield.controller;

import java.lang.management.ManagementFactory;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobshield.jobs.repository.JobAnalysisRepository;

@RestController
@RequestMapping("/api/system")
public class SystemMetricsController {

    private final JobAnalysisRepository jobAnalysisRepository;

    public SystemMetricsController(JobAnalysisRepository jobAnalysisRepository) {
        this.jobAnalysisRepository = jobAnalysisRepository;
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory() / (1024 * 1024);
        long freeMemory = runtime.freeMemory() / (1024 * 1024);
        long usedMemory = totalMemory - freeMemory;
        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

        long totalScans = jobAnalysisRepository.count();
        long scamsBlocked = jobAnalysisRepository.countByRiskLevel("HIGH");
        long verifiedSafe = jobAnalysisRepository.countByRiskLevel("LOW");

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("platform", "JobShield Enterprise Fraud Detection Platform");
        metrics.put("status", "HEALTHY");
        metrics.put("aiEngine", "Google Gemini Flash 2.5 + Offline Heuristic Fallback Engine");
        metrics.put("uptimeSeconds", uptimeSeconds);

        Map<String, Object> jvmStats = new LinkedHashMap<>();
        jvmStats.put("javaVersion", System.getProperty("java.version"));
        jvmStats.put("availableProcessors", runtime.availableProcessors());
        jvmStats.put("usedMemoryMB", usedMemory);
        jvmStats.put("totalAllocatedMemoryMB", totalMemory);
        jvmStats.put("maxMemoryMB", runtime.maxMemory() / (1024 * 1024));
        metrics.put("jvmTelemetry", jvmStats);

        Map<String, Object> fraudTelemetry = new LinkedHashMap<>();
        fraudTelemetry.put("totalAnalysesConducted", totalScans);
        fraudTelemetry.put("scamsIntercepted", scamsBlocked);
        fraudTelemetry.put("verifiedLegitimateJobs", verifiedSafe);
        metrics.put("securityTelemetry", fraudTelemetry);

        return ResponseEntity.ok(metrics);
    }
}
