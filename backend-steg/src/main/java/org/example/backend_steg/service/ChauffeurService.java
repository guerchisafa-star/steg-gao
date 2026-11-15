package org.example.backend_steg.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_steg.enums.ChauffeurEtat;
import org.example.backend_steg.model.Chauffeur;
import org.example.backend_steg.repository.ChauffeurRepository;
import org.springframework.stereotype.Service;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChauffeurService {

    private final ChauffeurRepository repo;

    public List<Chauffeur> findAll() { return repo.findAll(); }
    public Optional<Chauffeur> findById(Long id) { return repo.findById(id); }

    public Chauffeur save(Chauffeur c) {
        repo.findByCin(c.getCin()).ifPresent(existing -> {
            if (!existing.getId().equals(c.getId()))
                throw new IllegalArgumentException("Un chauffeur avec ce CIN existe déjà.");
        });
        repo.findByNumeroPermis(c.getNumeroPermis()).ifPresent(existing -> {
            if (!existing.getId().equals(c.getId()))
                throw new IllegalArgumentException("Un chauffeur avec ce numéro de permis existe déjà.");
        });
        if (c.getDateExpirationPermis() != null && c.getDateObtentionPermis() != null
                && !c.getDateExpirationPermis().isAfter(c.getDateObtentionPermis()))
            throw new IllegalArgumentException("La date d'expiration doit être postérieure à la date d'obtention.");
        if (c.getDateNaissance() != null && c.getDateObtentionPermis() != null) {
            int age = Period.between(c.getDateNaissance(), c.getDateObtentionPermis()).getYears();
            if (age < 18)
                throw new IllegalArgumentException("Le chauffeur doit avoir au moins 18 ans à la date d'obtention du permis.");
        }
        return repo.save(c);
    }

    public void delete(Long id) { repo.deleteById(id); }

    public List<Chauffeur> search(String q) {
        return repo.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrCinContainingIgnoreCaseOrNumeroPermisContainingIgnoreCase(q, q, q, q);
    }

    public List<Chauffeur> findByEtat(ChauffeurEtat etat) { return repo.findByEtat(etat); }

    public List<Chauffeur> findByRegion(String region) { return repo.findByRegionIgnoreCase(region); }
}
