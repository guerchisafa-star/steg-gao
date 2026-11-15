export type VehiculeEtat = 'DISPONIBLE' | 'AFFECTE' | 'EN_MISSION' | 'EN_PANNE' | 'EN_MAINTENANCE' | 'HORS_SERVICE';

export interface Vehicule {
  id?: number;
  matricule: string;
  marque: string;
  modele: string;
  nombreChevaux: number;
  dateAcquisition: string;
  kilometrage: number;
  niveauCarburant: number;
  typeCarburant: string;
  region?: string;
  etat: VehiculeEtat;
}
