export type DirecteurStatut = 'ACTIF' | 'INACTIF';

export interface Directeur {
  id?: number;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  regionNom?: string;
  statut: DirecteurStatut;
  // Champs de création de compte (seulement à l'ajout)
  username?: string;
  plainPassword?: string;
}
