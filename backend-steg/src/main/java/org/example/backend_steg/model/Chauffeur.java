package org.example.backend_steg.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.example.backend_steg.enums.ChauffeurEtat;
import java.time.LocalDate;

@Entity
@Table(name = "chauffeurs", uniqueConstraints = {
    @UniqueConstraint(columnNames = "cin"),
    @UniqueConstraint(columnNames = "numeroPermis")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Chauffeur {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "Le CIN est obligatoire")
    @Pattern(regexp = "\\d{8}", message = "Le CIN doit contenir 8 chiffres")
    @Column(unique = true)
    private String cin;

    @NotBlank(message = "Le téléphone est obligatoire")
    private String telephone;

    @NotNull(message = "La date de naissance est obligatoire")
    private LocalDate dateNaissance;

    @NotBlank(message = "Le numéro de permis est obligatoire")
    @Column(unique = true)
    private String numeroPermis;

    @NotNull(message = "La date d'obtention du permis est obligatoire")
    private LocalDate dateObtentionPermis;

    @NotNull(message = "La date d'expiration du permis est obligatoire")
    private LocalDate dateExpirationPermis;

    private String region;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String photo;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ChauffeurEtat etat = ChauffeurEtat.DISPONIBLE;

    @Builder.Default
    private Integer missions = 0;
}
