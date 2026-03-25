package com.prescripto.backend.controller;

import com.prescripto.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AI CONTROLLER
 * ==============
 * Handles AI chatbot requests
 * Uses Google Gemini API (Free)
 */

@RestController
@RequestMapping("/api/prescripto/v1/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;


    /**
     * ASK AI
     * User sends question, AI gives answer
     * POST /api/prescripto/v1/ai/ask
     */
    @PostMapping("/ask")
    public Map<String, Object> askAI(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        return aiService.askGemini(question);
    }
}