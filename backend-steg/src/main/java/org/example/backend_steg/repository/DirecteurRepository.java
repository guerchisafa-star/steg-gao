package org.example.backend_steg.repository;

import org.example.backend_steg.model.Directeur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DirecteurRepository extends JpaRepository<Directeur, Long> {
    List<Directeur> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
    List<Directeur> findByRegionNom(String regionNom);
    Optional<Directeur> findByRegionNomIgnoreCase(String regionNom);
    Optional<Directeur> findByUsername(String username);
}
