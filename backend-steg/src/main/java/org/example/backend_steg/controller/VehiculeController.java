package org.example.backend_steg.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_steg.enums.UtilisateurRole;
import org.example.backend_steg.enums.VehiculeEtat;
import org.example.backend_steg.model.Utilisateur;
import org.example.backend_steg.model.Vehicule;
import org.example.backend_steg.repository.DirecteurRepository;
import org.example.backend_steg.repository.UtilisateurRepository;
import org.example.backend_steg.service.VehiculeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicules")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "http://localhost:*", allowCredentials = "true")
public class VehiculeController {

    private final VehiculeService service;
    private final UtilisateurRepository utilisateurRepo;
    private final DirecteurRepository directeurRepo;

    private String regionDuConnecte() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Optional<Utilisateur> u = utilisateurRepo.findByUsername(auth.getName());
        if (u.isEmpty()) return null;
        if (u.get().getRole() == UtilisateurRole.DIRECTEUR_GENERAL) return null;
        return directeurRepo.findByUsername(auth.getName())
                .map(d -> d.getRegionNom())
                .orElse(null);
    }

    @GetMapping
    public List<Vehicule> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) VehiculeEtat etat) {
        String region = regionDuConnecte();
        if (search != null && !search.isBlank()) {
            List<Vehicule> all = service.search(search);
            return region != null ? all.stream().filter(v -> region.equalsIgnoreCase(v.getRegion())).toList() : all;
        }
        if (etat != null) {
            List<Vehicule> byEtat = service.findByEtat(etat);
            return region != null ? byEtat.stream().filter(v -> region.equalsIgnoreCase(v.getRegion())).toList() : byEtat;
        }
        if (region != null) return service.findByRegion(region);
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicule> getById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Vehicule v) {
        try {
            String region = regionDuConnecte();
            if (region != null) v.setRegion(region);
            return ResponseEntity.ok(service.save(v));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Vehicule v) {
        return service.findById(id).map(existing -> {
            try {
                v.setId(id);
                String region = regionDuConnecte();
                if (region != null) v.setRegion(region);
                return ResponseEntity.ok((Object) service.save(v));
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

    @PatchMapping("/{id}/etat")
    public ResponseEntity<?> updateEtat(@PathVariable Long id, @RequestParam VehiculeEtat etat) {
        try {
            return ResponseEntity.ok(service.updateEtat(id, etat));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
