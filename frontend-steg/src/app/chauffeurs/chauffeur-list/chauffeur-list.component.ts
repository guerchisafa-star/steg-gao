import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chauffeur, ChauffeurEtat } from '../../models/chauffeur.model';
import { ChauffeurService } from '../../services/chauffeur.service';

@Component({
  selector: 'app-chauffeur-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <h1>Gestion des chauffeurs</h1>
      <button class="add-btn" routerLink="/chauffeurs/new">+ Ajouter un chauffeur</button>
    </div>

    <input class="search-box" [(ngModel)]="search" (ngModelChange)="load()" placeholder="Nom, CIN ou n° de permis" />

    <div class="filter-tabs">
      <button class="filter-tab" [class.active]="!activeFilter" (click)="setFilter(null)">Tous</button>
      <button class="filter-tab disponible"   [class.active]="activeFilter==='DISPONIBLE'"   (click)="setFilter('DISPONIBLE')">Disponible</button>
      <button class="filter-tab en_mission"   [class.active]="activeFilter==='EN_MISSION'"   (click)="setFilter('EN_MISSION')">En mission</button>
      <button class="filter-tab indisponible" [class.active]="activeFilter==='INDISPONIBLE'" (click)="setFilter('INDISPONIBLE')">Indisponible</button>
      <button class="filter-tab absent"       [class.active]="activeFilter==='ABSENT'"       (click)="setFilter('ABSENT')">Absent</button>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr><th>Nom</th><th>CIN</th><th>Permis</th><th>Missions</th><th>Disponibilité</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of chauffeurs">
            <td>
              {{ c.nom }} {{ c.prenom.charAt(0) }}.
              <span *ngIf="permisExpire(c)" class="badge badge-en_panne" style="margin-left:4px;font-size:11px">⚠ Permis expiré</span>
            </td>
            <td>{{ c.cin }}</td>
            <td>{{ c.numeroPermis }}</td>
            <td>{{ c.missions || 0 }}</td>
            <td><span class="badge" [ngClass]="badgeClass(c.etat)">{{ etatLabel(c.etat) }}</span></td>
            <td class="actions">
              <button class="btn btn-outline-primary" [routerLink]="['/chauffeurs', c.id]">Fiche</button>
              <button class="btn btn-outline-primary" [routerLink]="['/chauffeurs', c.id, 'edit']">Modifier</button>
            </td>
          </tr>
          <tr *ngIf="chauffeurs.length === 0">
            <td colspan="6" style="text-align:center;color:#aaa;padding:28px">Aucun chauffeur trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`.actions{display:flex;gap:6px}`]
})
export class ChauffeurListComponent implements OnInit {
  chauffeurs: Chauffeur[] = [];
  search = '';
  activeFilter: ChauffeurEtat | null = null;

  constructor(private service: ChauffeurService) {}
  ngOnInit() { this.load(); }
  load() { this.service.getAll(this.search || undefined, this.activeFilter || undefined).subscribe(c => this.chauffeurs = c); }
  setFilter(f: ChauffeurEtat | null) { this.activeFilter = f; this.load(); }

  permisExpire(c: Chauffeur): boolean {
    return !!c.dateExpirationPermis && new Date(c.dateExpirationPermis) < new Date();
  }

  badgeClass(e: ChauffeurEtat) {
    return { DISPONIBLE:'badge-disponible', EN_MISSION:'badge-en_mission', INDISPONIBLE:'badge-indisponible', ABSENT:'badge-absent' }[e];
  }
  etatLabel(e: ChauffeurEtat) {
    return { DISPONIBLE:'Disponible', EN_MISSION:'En mission', INDISPONIBLE:'Indisponible', ABSENT:'Absent' }[e];
  }
}
