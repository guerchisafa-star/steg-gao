import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chauffeur } from '../../models/chauffeur.model';
import { ChauffeurService } from '../../services/chauffeur.service';

@Component({
  selector: 'app-chauffeur-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="c">
      <div class="page-header">
        <h1>Fiche chauffeur</h1>
        <span class="badge" [ngClass]="badgeClass(c.etat)">{{ etatLabel(c.etat) }}</span>
      </div>

      <div class="detail-layout">
        <div>
          <div class="detail-card" style="display:flex;gap:20px;align-items:flex-start">
            <div style="width:64px;height:64px;border-radius:50%;background:#ddd;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:#888">
              <img *ngIf="c.photo" [src]="c.photo" style="width:100%;height:100%;object-fit:cover" alt="photo" />
              <span *ngIf="!c.photo">Photo</span>
            </div>
            <div>
              <h2 style="font-size:20px;font-weight:600">{{ c.prenom }} {{ c.nom }}</h2>
              <div style="color:#888;font-size:13px;margin-bottom:8px">Région de {{ c.region || 'N/A' }}</div>
              <div style="font-size:13px;color:#555;line-height:1.9">
                <div>CIN : {{ c.cin }} · Téléphone : {{ c.telephone }}</div>
                <div>Né le {{ c.dateNaissance | date:'dd/MM/yyyy' }}</div>
                <div>
                  Permis {{ c.numeroPermis }} · obtenu le {{ c.dateObtentionPermis | date:'dd/MM/yyyy' }}
                  · expire le {{ c.dateExpirationPermis | date:'dd/MM/yyyy' }}
                  <span *ngIf="permisExpire()" class="badge badge-en_panne" style="margin-left:6px">⚠ Expiré</span>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-card">
            <strong>Historique des missions</strong>
            <table style="width:100%;margin-top:12px">
              <thead>
                <tr><th>N°</th><th>Intitulé</th><th>Date</th><th>Distance</th><th>État</th></tr>
              </thead>
              <tbody>
                <tr *ngIf="missions.length === 0">
                  <td colspan="5" style="text-align:center;color:#aaa;padding:16px">Aucune mission enregistrée</td>
                </tr>
                <tr *ngFor="let m of missions">
                  <td>{{ m.numero }}</td><td>{{ m.intitule }}</td><td>{{ m.date }}</td>
                  <td>{{ m.distance }}</td>
                  <td><span class="badge badge-disponible">{{ m.etat }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="action-panel">
          <div class="stat-box" style="margin-bottom:4px">
            <div class="label">Missions effectuées</div>
            <div class="value">{{ c.missions || 0 }}</div>
          </div>
          <button class="btn btn-dark" style="width:100%;padding:12px"
            [disabled]="!affectable()"
            [title]="!affectable() ? 'Chauffeur non disponible ou permis expiré' : ''">
            Affecter à une mission
          </button>
          <button class="btn btn-outline-secondary" style="width:100%;padding:12px">Désaffecter</button>
          <button class="btn btn-outline-primary" style="width:100%;padding:12px"
            [routerLink]="['/chauffeurs', c.id, 'edit']">Modifier</button>
        </div>
      </div>
    </div>
  `
})
export class ChauffeurDetailComponent implements OnInit {
  c?: Chauffeur;
  missions: any[] = [];

  constructor(private service: ChauffeurService, private route: ActivatedRoute) {}
  ngOnInit() { this.service.getById(+this.route.snapshot.paramMap.get('id')!).subscribe(x => this.c = x); }

  permisExpire(): boolean {
    return !!this.c?.dateExpirationPermis && new Date(this.c.dateExpirationPermis) < new Date();
  }
  affectable(): boolean { return this.c?.etat === 'DISPONIBLE' && !this.permisExpire(); }

  badgeClass(e: string) {
    return ({ DISPONIBLE:'badge-disponible', EN_MISSION:'badge-en_mission', INDISPONIBLE:'badge-indisponible', ABSENT:'badge-absent' } as any)[e] || '';
  }
  etatLabel(e: string) {
    return ({ DISPONIBLE:'Disponible', EN_MISSION:'En mission', INDISPONIBLE:'Indisponible', ABSENT:'Absent' } as any)[e] || e;
  }
}
