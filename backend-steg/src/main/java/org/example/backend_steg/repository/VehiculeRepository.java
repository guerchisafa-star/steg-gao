package org.example.backend_steg.repository;

import org.example.backend_steg.enums.VehiculeEtat;
import org.example.backend_steg.model.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    List<Vehicule> findByMatriculeContainingIgnoreCaseOrMarqueContainingIgnoreCase(String matricule, String marque);
    List<Vehicule> findByEtat(VehiculeEtat etat);
    Optional<Vehicule> findByMatricule(String matricule);
    long countByRegionIgnoreCase(String region);
    List<Vehicule> findByRegionIgnoreCase(String region);
}
