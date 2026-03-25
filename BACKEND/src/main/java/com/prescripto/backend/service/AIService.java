package com.prescripto.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

/**
 * AI SERVICE - FINAL FIX
 * =======================
 * Uses Google Gemini API v1 (stable)
 * Model: gemini-1.5-flash
 */

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    // FIXED: Using v1 API (not v1beta)
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";


    /**
     * ASK GEMINI AI
     */
    public Map<String, Object> askGemini(String question) {

        Map<String, Object> response = new HashMap<>();

        // Check API key
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            response.put("success", false);
            response.put("answer", "API key not configured.");
            return response;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            String url = GEMINI_URL + "?key=" + apiKey;

            // Build request
            String prompt = "You are a helpful health assistant. Give short answers (2-3 lines max). " +
                    "Answer about medicines, health tips, side effects. Suggest consulting doctor for serious issues.\n\n" +
                    "Question: " + question;

            // Request body structure
            Map<String, Object> requestBody = new HashMap<>();

            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();

            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            parts.add(part);

            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // API Call
            ResponseEntity<Map> apiResponse = restTemplate.postForEntity(url, entity, Map.class);

            if (apiResponse.getStatusCode() == HttpStatus.OK && apiResponse.getBody() != null) {
                String answer = extractAnswer(apiResponse.getBody());
                response.put("success", true);
                response.put("answer", answer);
            } else {
                response.put("success", false);
                response.put("answer", "No response. Try again.");
            }

        } catch (Exception e) {
            System.out.println("❌ AI Error: " + e.getMessage());
            response.put("success", false);
            response.put("answer", "Error: " + getErrorMessage(e.getMessage()));
        }

        return response;
    }

    /**
     * Extract answer from Gemini response
     */
    private String extractAnswer(Map<String, Object> body) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            System.out.println("Parse error: " + e.getMessage());
        }
        return "Could not get response.";
    }

    /**
     * Get user-friendly error message
     */
    private String getErrorMessage(String error) {
        if (error.contains("401")) return "Invalid API key.";
        if (error.contains("403")) return "API access denied.";
        if (error.contains("404")) return "Model not available. Check API key region.";
        if (error.contains("429")) return "Rate limit. Wait and try again.";
        return "Connection failed. Try again.";
    }
}