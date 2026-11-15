package org.example.backend_steg.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.example.backend_steg.enums.VehiculeEtat;
import java.time.LocalDate;

@Entity
@Table(name = "vehicules", uniqueConstraints = {
    @UniqueConstraint(columnNames = "matricule")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicule {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le matricule est obligatoire")
    @Column(unique = true)
    private String matricule;

    @NotBlank(message = "La marque est obligatoire")
    private String marque;

    @NotBlank(message = "Le modèle est obligatoire")
    private String modele;

    private Integer nombreChevaux;
    private LocalDate dateAcquisition;

    @Min(value = 0, message = "Le kilométrage doit être positif ou nul")
    @Builder.Default
    private Long kilometrage = 0L;

    @Min(0) @Max(100)
    @Builder.Default
    private Integer niveauCarburant = 0;

    private String typeCarburant;

    private String region;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VehiculeEtat etat = VehiculeEtat.DISPONIBLE;
}
