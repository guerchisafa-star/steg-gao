package org.example.backend_steg.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.backend_steg.enums.RegionEtat;

@Entity
@Table(name = "regions", uniqueConstraints = {
    @UniqueConstraint(columnNames = "nom"),
    @UniqueConstraint(columnNames = "code")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Region {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(unique = true)
    private String nom;

    @NotBlank(message = "Le code est obligatoire")
    @Column(unique = true)
    private String code;

    private String directeur;

    @Builder.Default
    private Integer chauffeurs = 0;

    @Builder.Default
    private Integer vehicules = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RegionEtat etat = RegionEtat.ACTIVE;
}
