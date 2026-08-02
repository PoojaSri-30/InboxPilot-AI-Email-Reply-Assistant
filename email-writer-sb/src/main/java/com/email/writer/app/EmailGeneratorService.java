package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );

        System.out.println("Calling Gemini...");
        System.out.println(geminiApiUrl + geminiApiKey);

        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println(response);

        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode candidates = root.path("candidates");

            if (candidates.isMissingNode() || candidates.isEmpty()) {
                return "No response returned by Gemini.";
            }

            return candidates
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to parse Gemini response.";
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("Generate a professional email reply for the following email.\n\n");

        if (emailRequest.getTone() != null &&
                !emailRequest.getTone().isBlank()) {

            prompt.append("Tone: ")
                    .append(emailRequest.getTone())
                    .append("\n\n");
        }

        prompt.append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}