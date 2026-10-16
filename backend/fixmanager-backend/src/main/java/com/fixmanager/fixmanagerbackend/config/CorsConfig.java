package com.fixmanager.fixmanagerbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration CORS pour autoriser le frontend Vite a communiquer avec le backend Spring Boot.
 * Sans cette configuration, le navigateur bloque les requetes AJAX entre localhost:5173 et localhost:8080.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Ouvre les routes de l'API aux origines du frontend local.
     * Les methodes HTTP exposees sont celles utilisees par le CRUD classique.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
