package com.jobshield.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.jobshield.auth.entity.User;
import com.jobshield.auth.repository.UserRepository;
import com.jobshield.campaign.entity.ScamCampaign;
import com.jobshield.campaign.repository.ScamCampaignRepository;
import com.jobshield.jobs.entity.JobAnalysis;
import com.jobshield.jobs.repository.JobAnalysisRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobAnalysisRepository jobAnalysisRepository;
    private final ScamCampaignRepository scamCampaignRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           JobAnalysisRepository jobAnalysisRepository,
                           ScamCampaignRepository scamCampaignRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobAnalysisRepository = jobAnalysisRepository;
        this.scamCampaignRepository = scamCampaignRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure default Interviewer / Recruiter demo account exists
        User demoUser = userRepository.findByEmail("demo@jobshield.com")
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail("demo@jobshield.com");
                    user.setPasswordHash(passwordEncoder.encode("Password@123"));
                    user.setFirstName("Demo");
                    user.setLastName("Recruiter");
                    user.setRole("USER");
                    user.setAccountStatus("ACTIVE");
                    user.setEmailVerified(true);
                    user.setCreatedAt(LocalDateTime.now().minusDays(7));
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                });

        // Seed realistic sample scan records if the demo user has none
        if (jobAnalysisRepository.countByUser(demoUser) == 0) {
            ScamCampaign campaign = scamCampaignRepository.findByCampaignCode("CAMP-2026-ADVANCE-FEE")
                    .orElseGet(() -> {
                        ScamCampaign c = new ScamCampaign();
                        c.setCampaignCode("CAMP-2026-ADVANCE-FEE");
                        c.setCreatedAt(LocalDateTime.now().minusDays(5));
                        return scamCampaignRepository.save(c);
                    });

            JobAnalysis scamScan = new JobAnalysis();
            scamScan.setUser(demoUser);
            scamScan.setCampaign(campaign);
            scamScan.setCompanyName("Apex Global Staffing");
            scamScan.setJobTitle("Remote Data Entry Clerk");
            scamScan.setSalary("$45.00/hr (Immediate Start)");
            scamScan.setRiskScore(88);
            scamScan.setRiskLevel("HIGH");
            scamScan.setAiReason("Applicant required to deposit $150 refundable equipment insurance fee. Directed to Telegram handle @apex_recruiter. High-risk advance-fee scam markers identified.");
            scamScan.setJobDescription("Work from home data entry. Earn $45/hr without interview. Contact recruiter on Telegram @apex_recruiter. A refundable deposit of $150 is required for company laptop setup.");
            scamScan.setCreatedAt(LocalDateTime.now().minusDays(1));
            jobAnalysisRepository.save(scamScan);

            JobAnalysis linkedScamScan = new JobAnalysis();
            linkedScamScan.setUser(demoUser);
            linkedScamScan.setCampaign(campaign);
            linkedScamScan.setCompanyName("Apex Talent Partners");
            linkedScamScan.setJobTitle("Executive Virtual Assistant");
            linkedScamScan.setSalary("$48.00/hr + Weekly Bonus");
            linkedScamScan.setRiskScore(92);
            linkedScamScan.setRiskLevel("HIGH");
            linkedScamScan.setAiReason("Identical Telegram handler @apex_recruiter and cashier check equipment purchase scam discovered under alternate company registration.");
            linkedScamScan.setJobDescription("High-paying virtual assistant role. Instant interview on Telegram @apex_recruiter. Equipment deposit required via certified bank check.");
            linkedScamScan.setCreatedAt(LocalDateTime.now().minusDays(2));
            jobAnalysisRepository.save(linkedScamScan);

            JobAnalysis safeScan = new JobAnalysis();
            safeScan.setUser(demoUser);
            safeScan.setCompanyName("Google LLC");
            safeScan.setJobTitle("Senior Java Backend Engineer");
            safeScan.setSalary("$155,000 - $180,000 / year");
            safeScan.setRiskScore(12);
            safeScan.setRiskLevel("LOW");
            safeScan.setAiReason("Official corporate recruitment channel (careers.google.com). Standard multi-stage interview pipeline with comprehensive compensation and benefits package.");
            safeScan.setJobDescription("Google Cloud is hiring a Senior Java Engineer to build distributed microservices in Java 17 and Kubernetes. Comprehensive 401(k), equity, and health benefits included.");
            safeScan.setCreatedAt(LocalDateTime.now().minusDays(3));
            jobAnalysisRepository.save(safeScan);
        }
    }
}
