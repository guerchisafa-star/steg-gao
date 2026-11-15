export type ChauffeurEtat = 'DISPONIBLE' | 'EN_MISSION' | 'INDISPONIBLE' | 'ABSENT';

export interface Chauffeur {
  id?: number;
  nom: string;
  prenom: string;
  cin: string;
  telephone: string;
  dateNaissance: string;
  numeroPermis: string;
  dateObtentionPermis: string;
  dateExpirationPermis: string;
  region: string;
  photo?: string;
  etat: ChauffeurEtat;
  missions?: number;
}
