package org.example.backend_steg.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_steg.enums.ChauffeurEtat;
import org.example.backend_steg.enums.UtilisateurRole;
import org.example.backend_steg.model.Chauffeur;
import org.example.backend_steg.model.Utilisateur;
import org.example.backend_steg.repository.DirecteurRepository;
import org.example.backend_steg.repository.UtilisateurRepository;
import org.example.backend_steg.service.ChauffeurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chauffeurs")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "http://localhost:*", allowCredentials = "true")
public class ChauffeurController {

    private final ChauffeurService service;
    private final UtilisateurRepository utilisateurRepo;
    private final DirecteurRepository directeurRepo;

    /** Retourne la région du DR connecté, ou null si DG */
    private String regionDuConnecte() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Optional<Utilisateur> u = utilisateurRepo.findByUsername(auth.getName());
        if (u.isEmpty()) return null;
        if (u.get().getRole() == UtilisateurRole.DIRECTEUR_GENERAL) return null; // DG voit tout
        return directeurRepo.findByUsername(auth.getName())
                .map(d -> d.getRegionNom())
                .orElse(null);
    }

    @GetMapping
    public List<Chauffeur> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ChauffeurEtat etat) {
        String region = regionDuConnecte();
        // Si DR avec région affectée → filtre par région
        // Si DR sans région ou DG → tout retourner
        if (search != null && !search.isBlank()) {
            List<Chauffeur> all = service.search(search);
            return region != null ? all.stream().filter(c -> region.equalsIgnoreCase(c.getRegion())).toList() : all;
        }
        if (etat != null) {
            List<Chauffeur> byEtat = service.findByEtat(etat);
            return region != null ? byEtat.stream().filter(c -> region.equalsIgnoreCase(c.getRegion())).toList() : byEtat;
        }
        if (region != null) return service.findByRegion(region);
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chauffeur> getById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Chauffeur c) {
        try {
            String region = regionDuConnecte();
            // Si DR sans région affectée, on accepte quand même la région saisie
            if (region != null) c.setRegion(region);
            return ResponseEntity.ok(service.save(c));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Chauffeur c) {
        return service.findById(id).map(existing -> {
            try {
                c.setId(id);
                String region = regionDuConnecte();
                if (region != null) c.setRegion(region);
                return ResponseEntity.ok((Object) service.save(c));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body((Object) Map.of("message", e.getMessage()));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
