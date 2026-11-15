package org.example.backend_steg.repository;

import org.example.backend_steg.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByUsername(String username);
}
