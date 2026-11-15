import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Region } from '../../models/region.model';
import { RegionService } from '../../services/region.service';

@Component({
  selector: 'app-region-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="region">
      <div class="page-header">
        <h1>Région de {{ region.nom }}</h1>
        <span class="badge" [ngClass]="region.etat === 'ACTIVE' ? 'badge-active' : 'badge-desactivee'">
          {{ region.etat === 'ACTIVE' ? 'Active' : 'Désactivée' }}
        </span>
      </div>

      <div class="detail-layout">
        <div>
          <div class="stat-grid">
            <div class="stat-box">
              <div class="label">Directeur régional</div>
              <div style="font-size:17px;font-weight:600;margin-top:4px;color:#1a3a6b">
                {{ region.directeur || 'Non affecté' }}
              </div>
            </div>
            <div class="stat-box">
              <div class="label">Chauffeurs</div>
              <div class="value">{{ region.chauffeurs || 0 }}</div>
            </div>
            <div class="stat-box">
              <div class="label">Véhicules</div>
              <div class="value">{{ region.vehicules || 0 }}</div>
            </div>
            <div class="stat-box">
              <div class="label">Missions en cours</div>
              <div class="value">0</div>
            </div>
          </div>

          <div class="detail-card">
            <strong>Directeur affecté à la région</strong>
            <div style="margin-top:12px;font-size:14px;color:#555">
              <div *ngIf="region.directeur">{{ region.directeur }} · Directeur régional</div>
              <div *ngIf="!region.directeur" style="color:#aaa">Aucun directeur affecté</div>
            </div>
          </div>
        </div>

        <div class="action-panel">
          <button class="btn btn-dark" style="width:100%;padding:12px"
            [routerLink]="['/regions', region.id, 'edit']">Modifier</button>
          <button class="btn" style="width:100%;padding:12px"
            [ngClass]="region.etat === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-secondary'"
            (click)="toggle()">
            {{ region.etat === 'ACTIVE' ? 'Désactiver' : 'Réactiver' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class RegionDetailComponent implements OnInit {
  region?: Region;

  constructor(private service: RegionService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.service.getById(+this.route.snapshot.paramMap.get('id')!).subscribe(r => this.region = r);
  }

  toggle() {
    this.service.toggleEtat(this.region!.id!).subscribe(r => this.region = r);
  }
}
