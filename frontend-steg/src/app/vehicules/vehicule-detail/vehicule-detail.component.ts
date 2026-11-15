import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Vehicule, VehiculeEtat } from '../../models/vehicule.model';
import { VehiculeService } from '../../services/vehicule.service';

@Component({
  selector: 'app-vehicule-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="v">
      <div class="page-header">
        <h1>Fiche véhicule</h1>
        <span class="badge" [ngClass]="badgeClass(v.etat)">{{ etatLabel(v.etat) }}</span>
      </div>

      <div class="detail-layout">
        <div>
          <div class="detail-card">
            <h2 style="font-size:18px;font-weight:600;margin-bottom:12px">{{ v.matricule }} · {{ v.marque }} {{ v.modele }}</h2>
            <div style="color:#555;font-size:14px;line-height:1.9">
              <div>{{ v.nombreChevaux }} chevaux · {{ v.typeCarburant }}</div>
              <div>Acquis le {{ v.dateAcquisition | date:'dd/MM/yyyy' }}</div>
              <div>Kilométrage : {{ v.kilometrage.toLocaleString() }} km</div>
              <div style="display:flex;align-items:center;gap:8px">
                Carburant :
                <div style="width:80px;height:7px;background:#eee;border-radius:4px;overflow:hidden">
                  <div [style.width.%]="v.niveauCarburant"
                    [style.background]="v.niveauCarburant < 20 ? '#e74c3c' : v.niveauCarburant < 50 ? '#f39c12' : '#27ae60'"
                    style="height:100%"></div>
                </div>
                {{ v.niveauCarburant }} %
              </div>
            </div>
          </div>

          <div class="detail-card">
            <strong>États possibles</strong>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
              <span class="badge badge-disponible">Disponible</span>
              <span class="badge badge-affecte">Affecté</span>
              <span class="badge badge-en_mission">En mission</span>
              <span class="badge badge-en_panne">En panne</span>
              <span class="badge badge-en_maintenance">En maintenance</span>
              <span class="badge badge-hors_service">Hors service</span>
            </div>
          </div>
        </div>

        <div class="action-panel">
          <button class="btn btn-dark" style="width:100%;padding:12px"
            [disabled]="v.etat !== 'DISPONIBLE'"
            [title]="v.etat !== 'DISPONIBLE' ? 'Véhicule non disponible' : ''">
            Affecter à une mission
          </button>
          <button class="btn btn-outline-danger" style="width:100%;padding:12px"
            *ngIf="v.etat !== 'EN_PANNE'" (click)="setEtat('EN_PANNE')">
            Déclarer en panne
          </button>
          <button class="btn btn-outline-primary" style="width:100%;padding:12px"
            *ngIf="v.etat !== 'DISPONIBLE'" (click)="setEtat('DISPONIBLE')">
            Déclarer disponible
          </button>
          <button class="btn btn-outline-primary" style="width:100%;padding:12px"
            [routerLink]="['/vehicules', v.id, 'edit']">Modifier</button>
        </div>
      </div>
    </div>
  `
})
export class VehiculeDetailComponent implements OnInit {
  v?: Vehicule;

  constructor(private service: VehiculeService, private route: ActivatedRoute) {}
  ngOnInit() { this.service.getById(+this.route.snapshot.paramMap.get('id')!).subscribe(x => this.v = x); }

  setEtat(e: VehiculeEtat) { this.service.updateEtat(this.v!.id!, e).subscribe(x => this.v = x); }

  badgeClass(e: VehiculeEtat) {
    const m: Record<VehiculeEtat,string> = { DISPONIBLE:'badge-disponible', AFFECTE:'badge-affecte', EN_MISSION:'badge-en_mission', EN_PANNE:'badge-en_panne', EN_MAINTENANCE:'badge-en_maintenance', HORS_SERVICE:'badge-hors_service' };
    return m[e];
  }
  etatLabel(e: VehiculeEtat) {
    const m: Record<VehiculeEtat,string> = { DISPONIBLE:'Disponible', AFFECTE:'Affecté', EN_MISSION:'En mission', EN_PANNE:'En panne', EN_MAINTENANCE:'En maintenance', HORS_SERVICE:'Hors service' };
    return m[e];
  }
}
