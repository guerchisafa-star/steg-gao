export type RegionEtat = 'ACTIVE' | 'DESACTIVEE';

export interface Region {
  id?: number;
  nom: string;
  code: string;
  directeur?: string;
  chauffeurs?: number;
  vehicules?: number;
  etat: RegionEtat;
}
