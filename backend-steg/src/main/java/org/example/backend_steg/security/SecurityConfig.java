package org.example.backend_steg.security;

import lombok.RequiredArgsConstructor;
import org.example.backend_steg.model.Utilisateur;
import org.example.backend_steg.repository.UtilisateurRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuration de sécurité complète.
 * Authentification par session HTTP (pas de JWT).
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UtilisateurRepository utilisateurRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            Utilisateur u = utilisateurRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException(
                            "Utilisateur introuvable : " + username));
            return new User(
                    u.getUsername(),
                    u.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()))
            );
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .securityContext(sc -> sc
                .securityContextRepository(new HttpSessionSecurityContextRepository())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/auth/logout").permitAll()
                .requestMatchers("/api/regions/**").hasRole("DIRECTEUR_GENERAL")
                .requestMatchers("/api/directeurs/**").hasRole("DIRECTEUR_GENERAL")
                .requestMatchers("/api/chauffeurs/**").hasAnyRole("DIRECTEUR_GENERAL", "DIRECTEUR_REGIONAL")
                .requestMatchers("/api/vehicules/**").hasAnyRole("DIRECTEUR_GENERAL", "DIRECTEUR_REGIONAL")
                .requestMatchers("/api/profil/**").hasAnyRole("DIRECTEUR_GENERAL", "DIRECTEUR_REGIONAL", "CHAUFFEUR")
                .anyRequest().authenticated()
            )
            .userDetailsService(userDetailsService());

        return http.build();
    }
}
