import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicule } from '../../models/vehicule.model';
import { VehiculeService } from '../../services/vehicule.service';
import { RegionService } from '../../services/region.service';
import { Region } from '../../models/region.model';

@Component({
  selector: 'app-vehicule-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h1>{{ isEdit ? 'Modifier' : 'Ajouter' }} un véhicule</h1>
    <div class="form-card" style="margin-top:24px; max-width:860px">
      <div class="alert-error" *ngIf="errorMsg">{{ errorMsg }}</div>

      <div class="form-grid">
        <div class="form-group">
          <label>Matricule <span class="req">*</span></label>
          <input [(ngModel)]="v.matricule" [class.invalid]="sub && !v.matricule" placeholder="456 TU 8812" />
          <span class="ferr" *ngIf="sub && !v.matricule">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>Marque <span class="req">*</span></label>
          <input [(ngModel)]="v.marque" [class.invalid]="sub && !v.marque" placeholder="Toyota" />
          <span class="ferr" *ngIf="sub && !v.marque">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>Modèle <span class="req">*</span></label>
          <input [(ngModel)]="v.modele" [class.invalid]="sub && !v.modele" placeholder="Hilux" />
          <span class="ferr" *ngIf="sub && !v.modele">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>Nombre de chevaux</label>
          <input type="number" [(ngModel)]="v.nombreChevaux" placeholder="8" min="1" />
        </div>
        <div class="form-group">
          <label>Date d'acquisition</label>
          <input type="date" [(ngModel)]="v.dateAcquisition" />
        </div>
        <div class="form-group">
          <label>Kilométrage <span class="req">*</span></label>
          <input type="number" [(ngModel)]="v.kilometrage"
            [class.invalid]="sub && v.kilometrage < 0" placeholder="60004" min="0" />
          <span class="ferr" *ngIf="sub && v.kilometrage < 0">Doit être positif ou nul</span>
        </div>
        <div class="form-group">
          <label>Niveau de carburant (%)</label>
          <input type="number" [(ngModel)]="v.niveauCarburant"
            [class.invalid]="sub && (v.niveauCarburant < 0 || v.niveauCarburant > 100)"
            placeholder="35" min="0" max="100" />
          <span class="ferr" *ngIf="sub && (v.niveauCarburant < 0 || v.niveauCarburant > 100)">Entre 0 et 100</span>
        </div>
        <div class="form-group">
          <label>Type de carburant</label>
          <input [(ngModel)]="v.typeCarburant" placeholder="Diesel" />
        </div>
        <div class="form-group">
          <label>Région</label>
          <select [(ngModel)]="v.region">
            <option [ngValue]="null">— Aucune région —</option>
            <option *ngFor="let r of regions" [value]="r.nom">{{ r.nom }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>État</label>
          <select [(ngModel)]="v.etat">
            <option value="DISPONIBLE">Disponible</option>
            <option value="AFFECTE">Affecté</option>
            <option value="EN_MISSION">En mission</option>
            <option value="EN_PANNE">En panne</option>
            <option value="EN_MAINTENANCE">En maintenance</option>
            <option value="HORS_SERVICE">Hors service</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-cancel" routerLink="/vehicules">Annuler</button>
        <button class="btn btn-save" (click)="save()" [disabled]="saving">
          {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .alert-error { background:#fdf2f2;color:#c0392b;border:1px solid #f5c6cb;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:13px; }
    .req { color:#c0392b; }
    .invalid { border-color:#c0392b !important; }
    .ferr { color:#c0392b; font-size:12px; }
  `]
})
export class VehiculeFormComponent implements OnInit {
  v: Vehicule = {
    matricule: '', marque: '', modele: '', nombreChevaux: 0,
    dateAcquisition: '', kilometrage: 0, niveauCarburant: 0,
    typeCarburant: '', region: undefined, etat: 'DISPONIBLE'
  };
  regions: Region[] = [];
  isEdit = false;
  sub = false;
  saving = false;
  errorMsg = '';

  constructor(
    private service: VehiculeService,
    private regionService: RegionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.regionService.getAll().subscribe(r => this.regions = r);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.getById(+id).subscribe(x => this.v = x);
    }
  }

  save() {
    this.sub = true;
    this.errorMsg = '';
    if (!this.v.matricule || !this.v.marque || !this.v.modele ||
        this.v.kilometrage < 0 || this.v.niveauCarburant < 0 || this.v.niveauCarburant > 100) return;
    this.saving = true;
    const obs = this.isEdit
      ? this.service.update(this.v.id!, this.v)
      : this.service.create(this.v);
    obs.subscribe({
      next: () => this.router.navigate(['/vehicules']),
      error: err => { this.saving = false; this.errorMsg = err.error?.message || 'Une erreur est survenue.'; }
    });
  }
}
