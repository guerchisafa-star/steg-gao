package org.example.backend_steg.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_steg.enums.UtilisateurRole;
import org.example.backend_steg.model.Directeur;
import org.example.backend_steg.model.Region;
import org.example.backend_steg.model.Utilisateur;
import org.example.backend_steg.repository.DirecteurRepository;
import org.example.backend_steg.repository.RegionRepository;
import org.example.backend_steg.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DirecteurService {

    private final DirecteurRepository directeurRepo;
    private final RegionRepository regionRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    public List<Directeur> findAll() { return directeurRepo.findAll(); }
    public Optional<Directeur> findById(Long id) { return directeurRepo.findById(id); }

    public List<Directeur> search(String q) {
        return directeurRepo.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(q, q);
    }

    @Transactional
    public Directeur save(Directeur d) {
        boolean isNew = (d.getId() == null);

        if (isNew) {
            String username = d.getUsername();
            String plainPwd = d.getPlainPassword();

            if (username == null || username.isBlank())
                throw new IllegalArgumentException("L'identifiant de connexion est obligatoire.");
            if (plainPwd == null || plainPwd.length() < 4)
                throw new IllegalArgumentException("Le mot de passe doit comporter au moins 4 caractères.");
            if (utilisateurRepo.findByUsername(username).isPresent())
                throw new IllegalArgumentException("Cet identifiant est déjà utilisé.");
            if (directeurRepo.findByUsername(username).isPresent())
                throw new IllegalArgumentException("Cet identifiant est déjà utilisé.");

            // Sauvegarder la fiche avec le username
            Directeur saved = directeurRepo.save(d);

            // Créer le compte utilisateur
            utilisateurRepo.save(Utilisateur.builder()
                    .username(username)
                    .password(passwordEncoder.encode(plainPwd))
                    .role(UtilisateurRole.DIRECTEUR_REGIONAL)
                    .nom(saved.getNom())
                    .prenom(saved.getPrenom())
                    .build());

            return saved;
        } else {
            // En modification : on ne touche pas au compte utilisateur
            return directeurRepo.save(d);
        }
    }

    @Transactional
    public void delete(Long id) {
        Directeur d = directeurRepo.findById(id).orElseThrow();
        if (d.getRegionNom() != null) desaffecterDeRegion(d);
        directeurRepo.deleteById(id);
    }

    @Transactional
    public Directeur affecter(Long directeurId, Long regionId) {
        Directeur directeur = directeurRepo.findById(directeurId)
                .orElseThrow(() -> new IllegalArgumentException("Directeur introuvable."));
        Region region = regionRepo.findById(regionId)
                .orElseThrow(() -> new IllegalArgumentException("Région introuvable."));

        // Désaffecter l'ancien directeur de cette région
        directeurRepo.findByRegionNomIgnoreCase(region.getNom()).ifPresent(ancien -> {
            if (!ancien.getId().equals(directeurId)) {
                ancien.setRegionNom(null);
                directeurRepo.save(ancien);
            }
        });

        // Libérer l'ancienne région du directeur
        if (directeur.getRegionNom() != null
                && !directeur.getRegionNom().equalsIgnoreCase(region.getNom())) {
            regionRepo.findByNomIgnoreCase(directeur.getRegionNom()).ifPresent(ancienneRegion -> {
                ancienneRegion.setDirecteur(null);
                regionRepo.save(ancienneRegion);
            });
        }

        directeur.setRegionNom(region.getNom());
        directeurRepo.save(directeur);

        region.setDirecteur(directeur.getPrenom() + " " + directeur.getNom().charAt(0) + ".");
        regionRepo.save(region);

        return directeur;
    }

    @Transactional
    public Directeur desaffecter(Long directeurId) {
        Directeur directeur = directeurRepo.findById(directeurId)
                .orElseThrow(() -> new IllegalArgumentException("Directeur introuvable."));
        desaffecterDeRegion(directeur);
        return directeurRepo.save(directeur);
    }

    private void desaffecterDeRegion(Directeur d) {
        if (d.getRegionNom() != null) {
            regionRepo.findByNomIgnoreCase(d.getRegionNom()).ifPresent(region -> {
                region.setDirecteur(null);
                regionRepo.save(region);
            });
            d.setRegionNom(null);
        }
    }
}
