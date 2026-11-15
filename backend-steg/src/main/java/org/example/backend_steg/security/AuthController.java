package org.example.backend_steg.security;

import lombok.RequiredArgsConstructor;
import org.example.backend_steg.repository.DirecteurRepository;
import org.example.backend_steg.repository.UtilisateurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "http://localhost:*", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final DirecteurRepository   directeurRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String username = body.get("username");
        String password = body.get("password");
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            SecurityContext sc = SecurityContextHolder.createEmptyContext();
            sc.setAuthentication(auth);
            SecurityContextHolder.setContext(sc);
            request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", sc);

            String role = auth.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("");

            return utilisateurRepository.findByUsername(username).map(u -> {
                Map<String, Object> resp = new HashMap<>();
                resp.put("username", u.getUsername());
                resp.put("role", role);
                resp.put("nom",    u.getNom()    != null ? u.getNom()    : "");
                resp.put("prenom", u.getPrenom() != null ? u.getPrenom() : "");
                if ("DIRECTEUR_REGIONAL".equals(role)) {
                    directeurRepository.findByUsername(username)
                        .ifPresent(d -> resp.put("regionNom",
                            d.getRegionNom() != null ? d.getRegionNom() : ""));
                }
                return ResponseEntity.ok(resp);
            }).orElse(ResponseEntity.status(401).build());

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Identifiants incorrects"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal()))
            return ResponseEntity.status(401).body(Map.of("error", "Non connecté"));

        return utilisateurRepository.findByUsername(auth.getName()).map(u -> {
            String role = auth.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("");
            Map<String, Object> resp = new HashMap<>();
            resp.put("username", u.getUsername());
            resp.put("role", role);
            resp.put("nom",    u.getNom()    != null ? u.getNom()    : "");
            resp.put("prenom", u.getPrenom() != null ? u.getPrenom() : "");
            if ("DIRECTEUR_REGIONAL".equals(role)) {
                directeurRepository.findByUsername(u.getUsername())
                    .ifPresent(d -> resp.put("regionNom",
                        d.getRegionNom() != null ? d.getRegionNom() : ""));
            }
            return ResponseEntity.ok(resp);
        }).orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Déconnecté"));
    }
}
