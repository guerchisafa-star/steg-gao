package org.example.backend_steg.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_steg.enums.VehiculeEtat;
import org.example.backend_steg.model.Vehicule;
import org.example.backend_steg.repository.VehiculeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehiculeService {

    private final VehiculeRepository repo;

    public List<Vehicule> findAll() { return repo.findAll(); }
    public Optional<Vehicule> findById(Long id) { return repo.findById(id); }

    public Vehicule save(Vehicule v) {
        repo.findByMatricule(v.getMatricule()).ifPresent(existing -> {
            if (!existing.getId().equals(v.getId()))
                throw new IllegalArgumentException("Un véhicule avec ce matricule existe déjà.");
        });
        return repo.save(v);
    }

    public void delete(Long id) { repo.deleteById(id); }

    public List<Vehicule> search(String q) {
        return repo.findByMatriculeContainingIgnoreCaseOrMarqueContainingIgnoreCase(q, q);
    }

    public List<Vehicule> findByEtat(VehiculeEtat etat) { return repo.findByEtat(etat); }

    public List<Vehicule> findByRegion(String region) { return repo.findByRegionIgnoreCase(region); }

    public Vehicule updateEtat(Long id, VehiculeEtat etat) {
        Vehicule v = repo.findById(id).orElseThrow();
        v.setEtat(etat);
        return repo.save(v);
    }
}
