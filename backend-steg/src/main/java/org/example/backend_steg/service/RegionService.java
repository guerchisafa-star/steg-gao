package org.example.backend_steg.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_steg.enums.RegionEtat;
import org.example.backend_steg.model.Region;
import org.example.backend_steg.repository.ChauffeurRepository;
import org.example.backend_steg.repository.RegionRepository;
import org.example.backend_steg.repository.VehiculeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegionService {

    private final RegionRepository repo;
    private final ChauffeurRepository chauffeurRepo;
    private final VehiculeRepository vehiculeRepo;

    // Recalcule les compteurs chauffeurs/vehicules depuis la vraie BDD
    private Region enrichir(Region r) {
        r.setChauffeurs((int) chauffeurRepo.countByRegionIgnoreCase(r.getNom()));
        r.setVehicules((int) vehiculeRepo.countByRegionIgnoreCase(r.getNom()));
        return r;
    }

    public List<Region> findAll() {
        return repo.findAll().stream().map(this::enrichir).toList();
    }

    public Optional<Region> findById(Long id) {
        return repo.findById(id).map(this::enrichir);
    }

    public Region save(Region r) {
        repo.findByNomIgnoreCase(r.getNom()).ifPresent(existing -> {
            if (!existing.getId().equals(r.getId()))
                throw new IllegalArgumentException("Une région avec ce nom existe déjà.");
        });
        repo.findByCodeIgnoreCase(r.getCode()).ifPresent(existing -> {
            if (!existing.getId().equals(r.getId()))
                throw new IllegalArgumentException("Une région avec ce code existe déjà.");
        });
        return enrichir(repo.save(r));
    }

    public void delete(Long id) {
        Region region = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Région introuvable."));
        long nb = chauffeurRepo.countByRegionIgnoreCase(region.getNom());
        if (nb > 0)
            throw new IllegalStateException("Suppression impossible : " + nb + " chauffeur(s) sont encore rattaché(s) à cette région.");
        repo.deleteById(id);
    }

    public List<Region> search(String q) {
        return repo.findByNomContainingIgnoreCaseOrCodeContainingIgnoreCase(q, q)
                .stream().map(this::enrichir).toList();
    }

    public Region toggleEtat(Long id) {
        Region r = repo.findById(id).orElseThrow();
        r.setEtat(r.getEtat() == RegionEtat.ACTIVE ? RegionEtat.DESACTIVEE : RegionEtat.ACTIVE);
        return enrichir(repo.save(r));
    }
}
