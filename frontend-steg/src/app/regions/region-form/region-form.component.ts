import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Region } from '../../models/region.model';
import { RegionService } from '../../services/region.service';
import { DirecteurService } from '../../services/directeur.service';
import { Directeur } from '../../models/directeur.model';

@Component({
  selector: 'app-region-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h1>{{ isEdit ? 'Modifier' : 'Ajouter' }} une région</h1>

    <div style="display:grid; grid-template-columns:1fr 280px; gap:20px; margin-top:24px;">
      <div class="form-card">
        <div class="alert-error" *ngIf="errorMsg">{{ errorMsg }}</div>

        <div class="form-grid">
          <div class="form-group">
            <label>Nom de la région <span class="req">*</span></label>
            <input [(ngModel)]="r.nom" [class.invalid]="sub && !r.nom" placeholder="Tunis" />
            <span class="ferr" *ngIf="sub && !r.nom">Champ obligatoire</span>
          </div>

          <div class="form-group">
            <label>Code <span class="req">*</span></label>
            <input [(ngModel)]="r.code" [class.invalid]="sub && !r.code" placeholder="TUN" />
            <span class="ferr" *ngIf="sub && !r.code">Champ obligatoire</span>
          </div>

          <div class="form-group">
            <label>Directeur régional</label>
            <select [(ngModel)]="selectedDirecteurId" (ngModelChange)="onDirecteurChange($event)">
              <option [ngValue]="null">— Aucun directeur —</option>
              <option *ngFor="let d of directeurs" [ngValue]="d.id">
                {{ d.prenom }} {{ d.nom }}
                <ng-container *ngIf="d.regionNom && d.regionNom !== r.nom">
                  &nbsp;(affecté à {{ d.regionNom }})
                </ng-container>
              </option>
            </select>
            <span style="font-size:11px; color:#aaa; margin-top:3px; display:block"
              *ngIf="directeurs.length === 0">
              Aucun directeur disponible — ajoutez-en dans la page Directeurs
            </span>
          </div>

          <div class="form-group">
            <label>État</label>
            <select [(ngModel)]="r.etat">
              <option value="ACTIVE">Active</option>
              <option value="DESACTIVEE">Désactivée</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-cancel" routerLink="/regions">Annuler</button>
          <button class="btn btn-save" (click)="save()" [disabled]="saving">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>

      <!-- Encadré directeurs affectés -->
      <div class="form-card">
        <strong>Directeurs affectés</strong>
        <div style="margin-top:12px; font-size:14px; color:#555;">
          <div *ngIf="directeurSelectionne">
            <span style="font-weight:500">{{ directeurSelectionne.prenom }} {{ directeurSelectionne.nom }}</span>
            &nbsp;·&nbsp;
            <span class="badge badge-disponible" style="font-size:11px">actif</span>
          </div>
          <div *ngIf="!directeurSelectionne" style="color:#aaa;">Aucun directeur affecté</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert-error { background:#fdf2f2; color:#c0392b; border:1px solid #f5c6cb; border-radius:6px; padding:10px 14px; margin-bottom:16px; font-size:13px; }
    .req { color:#c0392b; }
    .invalid { border-color:#c0392b !important; }
    .ferr { color:#c0392b; font-size:12px; }
  `]
})
export class RegionFormComponent implements OnInit {
  r: Region = { nom: '', code: '', etat: 'ACTIVE' };
  isEdit = false;
  sub = false;
  saving = false;
  errorMsg = '';

  directeurs: Directeur[] = [];
  selectedDirecteurId: number | null = null;

  get directeurSelectionne(): Directeur | null {
    return this.directeurs.find(d => d.id === this.selectedDirecteurId) ?? null;
  }

  constructor(
    private service: RegionService,
    private directeurService: DirecteurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Charger la liste des directeurs
    this.directeurService.getAll().subscribe(list => {
      this.directeurs = list;

      // En mode édition, pré-sélectionner le directeur courant
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEdit = true;
        this.service.getById(+id).subscribe(region => {
          this.r = region;
          if (region.directeur) {
            // Retrouver le directeur dont le nom correspond
            const match = this.directeurs.find(d =>
              `${d.prenom} ${d.nom.charAt(0)}.` === region.directeur ||
              `${d.prenom} ${d.nom}` === region.directeur ||
              region.directeur?.includes(d.nom)
            );
            if (match) this.selectedDirecteurId = match.id!;
          }
        });
      }
    });
  }

  onDirecteurChange(id: number | null) {
    if (id) {
      const d = this.directeurs.find(x => x.id === id);
      if (d) this.r.directeur = `${d.prenom} ${d.nom.charAt(0)}.`;
    } else {
      this.r.directeur = undefined;
    }
  }

  save() {
    this.sub = true;
    this.errorMsg = '';
    if (!this.r.nom || !this.r.code) return;
    this.saving = true;

    const obs = this.isEdit
      ? this.service.update(this.r.id!, this.r)
      : this.service.create(this.r);

    obs.subscribe({
      next: (savedRegion) => {
        // Si un directeur a été sélectionné, l'affecter à la région
        if (this.selectedDirecteurId && savedRegion.id) {
          this.directeurService.affecter(this.selectedDirecteurId, savedRegion.id).subscribe({
            next: () => this.router.navigate(['/regions']),
            error: () => this.router.navigate(['/regions']) // La région est créée même si l'affectation échoue
          });
        } else {
          this.router.navigate(['/regions']);
        }
      },
      error: err => {
        this.saving = false;
        this.errorMsg = err.error?.message || 'Une erreur est survenue.';
      }
    });
  }
}
