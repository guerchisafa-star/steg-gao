import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicule, VehiculeEtat } from '../../models/vehicule.model';
import { VehiculeService } from '../../services/vehicule.service';

@Component({
  selector: 'app-vehicule-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <h1>Gestion des véhicules</h1>
      <button class="add-btn" routerLink="/vehicules/new">+ Ajouter un véhicule</button>
    </div>

    <input class="search-box" [(ngModel)]="search" (ngModelChange)="load()" placeholder="Matricule, marque ou état" />

    <div class="filter-tabs">
      <button class="filter-tab" [class.active]="!activeFilter" (click)="setFilter(null)">Tous</button>
      <button *ngFor="let e of etats" class="filter-tab"
        [class.active]="activeFilter===e.val" (click)="setFilter(e.val)">{{ e.label }}</button>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr><th>Matricule</th><th>Marque</th><th>Modèle</th><th>Km</th><th>Carburant</th><th>État</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let v of vehicules">
            <td>{{ v.matricule }}</td>
            <td>{{ v.marque }}</td>
            <td>{{ v.modele }}</td>
            <td>{{ v.kilometrage.toLocaleString() }}</td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <div style="width:56px;height:7px;background:#eee;border-radius:4px;overflow:hidden">
                  <div [style.width.%]="v.niveauCarburant"
                    [style.background]="v.niveauCarburant < 20 ? '#e74c3c' : v.niveauCarburant < 50 ? '#f39c12' : '#27ae60'"
                    style="height:100%"></div>
                </div>
                {{ v.niveauCarburant }} %
              </div>
            </td>
            <td><span class="badge" [ngClass]="badgeClass(v.etat)">{{ etatLabel(v.etat) }}</span></td>
            <td class="actions">
              <button class="btn btn-outline-primary" [routerLink]="['/vehicules', v.id]">Fiche</button>
              <button class="btn btn-outline-primary" [routerLink]="['/vehicules', v.id, 'edit']">Modifier</button>
            </td>
          </tr>
          <tr *ngIf="vehicules.length === 0">
            <td colspan="7" style="text-align:center;color:#aaa;padding:28px">Aucun véhicule trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`.actions{display:flex;gap:6px}`]
})
export class VehiculeListComponent implements OnInit {
  vehicules: Vehicule[] = [];
  search = '';
  activeFilter: VehiculeEtat | null = null;
  etats = [
    { val: 'DISPONIBLE'     as VehiculeEtat, label: 'Disponible' },
    { val: 'AFFECTE'        as VehiculeEtat, label: 'Affecté' },
    { val: 'EN_MISSION'     as VehiculeEtat, label: 'En mission' },
    { val: 'EN_PANNE'       as VehiculeEtat, label: 'En panne' },
    { val: 'EN_MAINTENANCE' as VehiculeEtat, label: 'En maintenance' },
    { val: 'HORS_SERVICE'   as VehiculeEtat, label: 'Hors service' },
  ];

  constructor(private service: VehiculeService) {}
  ngOnInit() { this.load(); }
  load() { this.service.getAll(this.search || undefined, this.activeFilter || undefined).subscribe(v => this.vehicules = v); }
  setFilter(f: VehiculeEtat | null) { this.activeFilter = f; this.load(); }

  badgeClass(e: VehiculeEtat) {
    const m: Record<VehiculeEtat,string> = { DISPONIBLE:'badge-disponible', AFFECTE:'badge-affecte', EN_MISSION:'badge-en_mission', EN_PANNE:'badge-en_panne', EN_MAINTENANCE:'badge-en_maintenance', HORS_SERVICE:'badge-hors_service' };
    return m[e];
  }
  etatLabel(e: VehiculeEtat) {
    const m: Record<VehiculeEtat,string> = { DISPONIBLE:'Disponible', AFFECTE:'Affecté', EN_MISSION:'En mission', EN_PANNE:'En panne', EN_MAINTENANCE:'En maintenance', HORS_SERVICE:'Hors service' };
    return m[e];
  }
}
