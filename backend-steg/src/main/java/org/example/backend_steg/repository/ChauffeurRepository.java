package org.example.backend_steg.repository;

import org.example.backend_steg.enums.ChauffeurEtat;
import org.example.backend_steg.model.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
    List<Chauffeur> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrCinContainingIgnoreCaseOrNumeroPermisContainingIgnoreCase(
        String nom, String prenom, String cin, String permis);
    List<Chauffeur> findByEtat(ChauffeurEtat etat);
    List<Chauffeur> findByRegionIgnoreCase(String region);
    Optional<Chauffeur> findByCin(String cin);
    Optional<Chauffeur> findByNumeroPermis(String numeroPermis);
    long countByRegionIgnoreCase(String region);
}
