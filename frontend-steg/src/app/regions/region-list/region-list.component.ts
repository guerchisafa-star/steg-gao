import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Region } from '../../models/region.model';
import { RegionService } from '../../services/region.service';

@Component({
  selector: 'app-region-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <h1>Gestion des régions</h1>
      <button class="add-btn" routerLink="/regions/new">+ Ajouter une région</button>
    </div>

    <input class="search-box" [(ngModel)]="search" (ngModelChange)="load()"
      placeholder="Rechercher une région..." />

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>Région</th><th>Code</th><th>Directeur</th>
            <th>Chauffeurs</th><th>Véhicules</th><th>État</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of regions">
            <td>{{ r.nom }}</td>
            <td><strong>{{ r.code }}</strong></td>
            <td>{{ r.directeur || '—' }}</td>
            <td>{{ r.chauffeurs || 0 }}</td>
            <td>{{ r.vehicules || 0 }}</td>
            <td>
              <span class="badge"
                [ngClass]="r.etat === 'ACTIVE' ? 'badge-active' : 'badge-desactivee'">
                {{ r.etat === 'ACTIVE' ? 'Active' : 'Désactivée' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn btn-outline-primary"
                [routerLink]="['/regions', r.id]">Consulter</button>
              <button class="btn btn-outline-primary"
                [routerLink]="['/regions', r.id, 'edit']">Modifier</button>
              <button class="btn"
                [ngClass]="r.etat === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-secondary'"
                (click)="toggle(r)">
                {{ r.etat === 'ACTIVE' ? 'Désactiver' : 'Réactiver' }}
              </button>
            </td>
          </tr>
          <tr *ngIf="regions.length === 0">
            <td colspan="7"
              style="text-align:center;color:#aaa;padding:28px">
              Aucune région trouvée
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .actions { display:flex; gap:6px; flex-wrap:wrap; }
  `]
})
export class RegionListComponent implements OnInit {
  regions: Region[] = [];
  search = '';

  constructor(private service: RegionService) {}
  ngOnInit() { this.load(); }
  load() {
    this.service.getAll(this.search || undefined)
      .subscribe(r => this.regions = r);
  }

  toggle(r: Region) {
    this.service.toggleEtat(r.id!).subscribe(updated => {
      const idx = this.regions.findIndex(x => x.id === r.id);
      if (idx !== -1) this.regions[idx] = updated;
    });
  }
}
