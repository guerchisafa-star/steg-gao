package org.example.backend_steg.model;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend_steg.enums.UtilisateurRole;

@Entity
@Table(name = "utilisateurs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Utilisateur {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UtilisateurRole role;

    private String nom;
    private String prenom;
}
