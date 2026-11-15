package org.example.backend_steg.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.backend_steg.enums.DirecteurStatut;

@Entity
@Table(name = "directeurs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Directeur {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    private String telephone;
    private String email;
    private String regionNom;

    /** Identifiant de connexion lié au compte Utilisateur */
    @Column(unique = true)
    private String username;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DirecteurStatut statut = DirecteurStatut.ACTIF;

    /** Mot de passe en clair — transient, utilisé seulement à la création */
    @Transient
    private String plainPassword;
}
