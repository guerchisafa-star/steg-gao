package org.example.backend_steg.repository;

import org.example.backend_steg.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {
    List<Region> findByNomContainingIgnoreCaseOrCodeContainingIgnoreCase(String nom, String code);
    Optional<Region> findByNomIgnoreCase(String nom);
    Optional<Region> findByCodeIgnoreCase(String code);
}
