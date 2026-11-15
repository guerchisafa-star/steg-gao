package org.example.backend_steg.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_steg.model.Region;
import org.example.backend_steg.service.RegionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "http://localhost:*", allowCredentials = "true")
public class RegionController {

    private final RegionService service;

    @GetMapping
    public List<Region> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) return service.search(search);
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Region> getById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Region r) {
        try {
            return ResponseEntity.ok(service.save(r));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Region r) {
        return service.findById(id).map(existing -> {
            try {
                r.setId(id);
                return ResponseEntity.ok((Object) service.save(r));
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
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Region> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleEtat(id));
    }
}
