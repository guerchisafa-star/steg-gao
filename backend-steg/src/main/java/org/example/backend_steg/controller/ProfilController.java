package org.example.backend_steg.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_steg.model.Chauffeur;
import org.example.backend_steg.model.Utilisateur;
import org.example.backend_steg.repository.ChauffeurRepository;
import org.example.backend_steg.repository.UtilisateurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Endpoints pour le profil du chauffeur connecté.
 * Accessible aux rôles CHAUFFEUR, DIRECTEUR_REGIONAL et DIRECTEUR_GENERAL.
 */
@RestController
@RequestMapping("/api/profil")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "http://localhost:*", allowCredentials = "true")
public class ProfilController {

    private final UtilisateurRepository utilisateurRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final PasswordEncoder passwordEncoder;

    /** Retourne le profil du chauffeur lié à l'utilisateur connecté. */
    @GetMapping
    public ResponseEntity<?> getProfil() {
        Utilisateur u = currentUser();
        if (u == null) return ResponseEntity.status(401).build();

        // Cherche le chauffeur dont le CIN correspond au username (convention)
        Optional<Chauffeur> chauffeur = chauffeurRepository.findByCin(u.getUsername());
        if (chauffeur.isEmpty()) {
            // Fallback : retourner les infos de l'utilisateur seules
            return ResponseEntity.ok(Map.of(
                    "username", u.getUsername(),
                    "nom", u.getNom() != null ? u.getNom() : "",
                    "prenom", u.getPrenom() != null ? u.getPrenom() : ""
            ));
        }

        Chauffeur c = chauffeur.get();
        return ResponseEntity.ok(c);
    }

    /** Modifie le mot de passe de l'utilisateur connecté. */
    @PostMapping("/changer-mot-de-passe")
    public ResponseEntity<?> changerMotDePasse(@RequestBody Map<String, String> body) {
        Utilisateur u = currentUser();
        if (u == null) return ResponseEntity.status(401).build();

        String actuel   = body.get("actuel");
        String nouveau  = body.get("nouveau");
        String confirm  = body.get("confirmation");

        if (actuel == null || nouveau == null || confirm == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Tous les champs sont obligatoires."));
        }

        if (!passwordEncoder.matches(actuel, u.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Mot de passe actuel incorrect."));
        }

        if (!nouveau.equals(confirm)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le nouveau mot de passe et la confirmation ne correspondent pas."));
        }

        if (nouveau.length() < 4) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le nouveau mot de passe doit comporter au moins 4 caractères."));
        }

        u.setPassword(passwordEncoder.encode(nouveau));
        utilisateurRepository.save(u);

        return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès."));
    }

    // ── Utilitaire ──────────────────────────────────────────────

    private Utilisateur currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return utilisateurRepository.findByUsername(auth.getName()).orElse(null);
    }
}
