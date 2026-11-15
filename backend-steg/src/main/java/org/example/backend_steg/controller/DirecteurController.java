package org.example.backend_steg.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_steg.model.Directeur;
import org.example.backend_steg.service.DirecteurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/directeurs")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "http://localhost:*", allowCredentials = "true")
public class DirecteurController {

    private final DirecteurService service;

    @GetMapping
    public List<Directeur> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) return service.search(search);
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Directeur> getById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Directeur d) {
        try {
            return ResponseEntity.ok(service.save(d));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Directeur d) {
        return service.findById(id).map(existing -> {
            try {
                d.setId(id);
                return ResponseEntity.ok((Object) service.save(d));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body((Object) Map.of("message", e.getMessage()));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/affecter/{regionId}")
    public ResponseEntity<?> affecter(@PathVariable Long id, @PathVariable Long regionId) {
        try {
            return ResponseEntity.ok(service.affecter(id, regionId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/desaffecter")
    public ResponseEntity<?> desaffecter(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.desaffecter(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
