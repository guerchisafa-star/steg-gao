import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Directeur } from '../../models/directeur.model';
import { DirecteurService } from '../../services/directeur.service';
import { Region } from '../../models/region.model';
import { RegionService } from '../../services/region.service';

@Component({
  selector: 'app-directeur-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Gestion des directeurs</h1>
      <button class="add-btn" (click)="openForm()">+ Ajouter un directeur</button>
    </div>

    <input class="search-box" [(ngModel)]="search" (ngModelChange)="load()"
      placeholder="Rechercher un directeur..." />

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>Nom</th><th>Prénom</th><th>Téléphone</th><th>Email</th>
            <th>Région affectée</th><th>Statut</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let d of directeurs">
            <td>{{ d.nom }}</td>
            <td>{{ d.prenom }}</td>
            <td>{{ d.telephone || '—' }}</td>
            <td>{{ d.email || '—' }}</td>
            <td>
              <span *ngIf="d.regionNom" class="badge badge-active">{{ d.regionNom }}</span>
              <span *ngIf="!d.regionNom" style="color:#aaa">Non affecté</span>
            </td>
            <td>
              <span class="badge"
                [ngClass]="d.statut === 'ACTIF' ? 'badge-disponible' : 'badge-absent'">
                {{ d.statut === 'ACTIF' ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn btn-outline-primary" (click)="openDetail(d)">Consulter</button>
              <button class="btn btn-outline-primary" (click)="openForm(d)">Modifier</button>
              <button class="btn btn-outline-danger" (click)="openDelete(d)">Supprimer</button>
            </td>
          </tr>
          <tr *ngIf="directeurs.length === 0">
            <td colspan="7" style="text-align:center;color:#aaa;padding:28px">
              Aucun directeur trouvé
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══ Modal : Consulter ══ -->
    <div class="modal-backdrop" *ngIf="detail">
      <div class="modal" style="max-width:500px; text-align:left">
        <h3 style="margin-bottom:20px">Fiche directeur</h3>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; font-size:14px;">
          <div><span style="color:#888;font-size:12px">Nom</span><br><strong>{{ detail.nom }}</strong></div>
          <div><span style="color:#888;font-size:12px">Prénom</span><br><strong>{{ detail.prenom }}</strong></div>
          <div><span style="color:#888;font-size:12px">Téléphone</span><br>{{ detail.telephone || '—' }}</div>
          <div><span style="color:#888;font-size:12px">Email</span><br>{{ detail.email || '—' }}</div>
          <div>
            <span style="color:#888;font-size:12px">Région affectée</span><br>
            <span *ngIf="detail.regionNom" class="badge badge-active">{{ detail.regionNom }}</span>
            <span *ngIf="!detail.regionNom" style="color:#aaa">Non affecté</span>
          </div>
          <div>
            <span style="color:#888;font-size:12px">Statut</span><br>
            <span class="badge"
              [ngClass]="detail.statut === 'ACTIF' ? 'badge-disponible' : 'badge-absent'">
              {{ detail.statut === 'ACTIF' ? 'Actif' : 'Inactif' }}
            </span>
          </div>
        </div>

        <!-- Affectation depuis la fiche -->
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid #eee">
          <strong style="font-size:13px">Affecter à une région</strong>
          <div style="display:flex; gap:10px; margin-top:10px; align-items:center">
            <select [(ngModel)]="affectRegionId"
              style="flex:1;padding:9px;border:1px solid #ddd;border-radius:6px;font-size:14px">
              <option [ngValue]="null">— Choisir une région —</option>
              <option *ngFor="let r of regions" [ngValue]="r.id">
                {{ r.nom }} ({{ r.code }})
              </option>
            </select>
            <button class="btn btn-dark" (click)="saveAffectation()"
              [disabled]="!affectRegionId || affectSaving">
              {{ affectSaving ? '...' : 'Affecter' }}
            </button>
            <button class="btn btn-outline-secondary" *ngIf="detail.regionNom"
              (click)="desaffecter(detail)">
              Désaffecter
            </button>
          </div>
          <div class="alert-error" *ngIf="affectError" style="margin-top:10px">
            {{ affectError }}
          </div>
        </div>

        <div class="modal-actions" style="margin-top:20px">
          <button class="btn btn-cancel" (click)="detail = null; affectError = ''">Fermer</button>
        </div>
      </div>
    </div>

    <!-- ══ Modal : Ajouter / Modifier ══ -->
    <div class="modal-backdrop" *ngIf="showForm">
      <div class="modal" style="max-width:520px; text-align:left">
        <h3 style="margin-bottom:20px">
          {{ editing ? 'Modifier' : 'Ajouter' }} un directeur
        </h3>
        <div class="alert-error" *ngIf="formError">{{ formError }}</div>

        <div class="form-grid">
          <div class="form-group">
            <label>Nom <span class="req">*</span></label>
            <input [(ngModel)]="form.nom" [class.invalid]="formSub && !form.nom"
              placeholder="Ben Ali" />
            <span class="ferr" *ngIf="formSub && !form.nom">Champ obligatoire</span>
          </div>
          <div class="form-group">
            <label>Prénom <span class="req">*</span></label>
            <input [(ngModel)]="form.prenom" [class.invalid]="formSub && !form.prenom"
              placeholder="Karim" />
            <span class="ferr" *ngIf="formSub && !form.prenom">Champ obligatoire</span>
          </div>
          <div class="form-group">
            <label>Téléphone</label>
            <input [(ngModel)]="form.telephone" placeholder="+216 22 000 000" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input [(ngModel)]="form.email" placeholder="directeur@steg.com.tn" />
          </div>
          <div class="form-group">
            <label>Statut</label>
            <select [(ngModel)]="form.statut">
              <option value="ACTIF">Actif</option>
              <option value="INACTIF">Inactif</option>
            </select>
          </div>

          <!-- Compte de connexion — affiché seulement à l'ajout -->
          <ng-container *ngIf="!editing">
            <div class="form-group" style="grid-column:1/-1">
              <div style="border-top:1px solid #eee;padding-top:16px;margin-bottom:4px">
                <strong style="font-size:13px;color:#1a3a6b">🔐 Compte de connexion</strong>
                <span style="font-size:12px;color:#888;margin-left:8px">
                  Le directeur utilisera ces identifiants pour se connecter
                </span>
              </div>
            </div>
            <div class="form-group">
              <label>Identifiant <span class="req">*</span></label>
              <input [(ngModel)]="form.username"
                [class.invalid]="formSub && !form.username"
                placeholder="k.bensalah" />
              <span class="ferr" *ngIf="formSub && !form.username">Champ obligatoire</span>
            </div>
            <div class="form-group">
              <label>Mot de passe <span class="req">*</span></label>
              <input type="password" [(ngModel)]="form.plainPassword"
                [class.invalid]="formSub && (!form.plainPassword || form.plainPassword.length < 4)"
                placeholder="Min. 4 caractères" />
              <span class="ferr" *ngIf="formSub && (!form.plainPassword || form.plainPassword!.length < 4)">
                4 caractères minimum
              </span>
            </div>
          </ng-container>
        </div>

        <div class="modal-actions" style="margin-top:24px">
          <button class="btn btn-cancel" (click)="showForm = false">Annuler</button>
          <button class="btn btn-save" (click)="saveForm()" [disabled]="saving">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ Modal : Supprimer ══ -->
    <div class="modal-backdrop" *ngIf="toDelete">
      <div class="modal">
        <h3>Supprimer {{ toDelete.prenom }} {{ toDelete.nom }} ?</h3>
        <p>Cette action est définitive.</p>
        <div class="modal-actions">
          <button class="btn btn-cancel" (click)="toDelete = null">Annuler</button>
          <button class="btn btn-primary" (click)="deleteConfirmed()">Supprimer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .actions { display:flex; gap:6px; }
    .alert-error {
      background:#fdf2f2; color:#c0392b;
      border:1px solid #f5c6cb; border-radius:6px;
      padding:10px 14px; font-size:13px;
    }
    .req { color:#c0392b; }
    .invalid { border-color:#c0392b !important; }
    .ferr { color:#c0392b; font-size:12px; }
  `]
})
export class DirecteurListComponent implements OnInit {
  directeurs: Directeur[] = [];
  regions: Region[] = [];
  search = '';

  // Consulter
  detail: Directeur | null = null;
  affectRegionId: number | null = null;
  affectError = '';
  affectSaving = false;

  // Formulaire add/edit
  showForm = false;
  editing = false;
  form: Directeur = { nom: '', prenom: '', statut: 'ACTIF' };
  formSub = false;
  formError = '';
  saving = false;

  // Suppression
  toDelete: Directeur | null = null;

  constructor(
    private service: DirecteurService,
    private regionService: RegionService
  ) {}

  ngOnInit() { this.load(); this.loadRegions(); }

  load() {
    this.service.getAll(this.search || undefined)
      .subscribe(d => this.directeurs = d);
  }

  loadRegions() {
    this.regionService.getAll().subscribe(r => this.regions = r);
  }

  // ── Consulter ──
  openDetail(d: Directeur) {
    this.detail = { ...d };
    this.affectRegionId = null;
    this.affectError = '';
    this.affectSaving = false;
  }

  saveAffectation() {
    if (!this.affectRegionId || !this.detail) return;
    this.affectSaving = true;
    this.service.affecter(this.detail.id!, this.affectRegionId).subscribe({
      next: (updated) => {
        this.affectSaving = false;
        this.detail = { ...updated };
        this.load();
        this.loadRegions();
      },
      error: err => {
        this.affectSaving = false;
        this.affectError = err.error?.message || 'Erreur lors de l\'affectation.';
      }
    });
  }

  desaffecter(d: Directeur) {
    this.service.desaffecter(d.id!).subscribe(updated => {
      this.detail = { ...updated };
      this.load();
      this.loadRegions();
    });
  }

  // ── Formulaire ──
  openForm(d?: Directeur) {
    this.editing = !!d;
    this.form = d ? { ...d } : { nom: '', prenom: '', statut: 'ACTIF' };
    this.formSub = false;
    this.formError = '';
    this.saving = false;
    this.showForm = true;
  }

  saveForm() {
    this.formSub = true;
    this.formError = '';
    if (!this.form.nom || !this.form.prenom) return;
    if (!this.editing) {
      if (!this.form.username) return;
      if (!this.form.plainPassword || this.form.plainPassword.length < 4) return;
    }
    this.saving = true;
    const obs = this.editing
      ? this.service.update(this.form.id!, this.form)
      : this.service.create(this.form);
    obs.subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: err => {
        this.saving = false;
        this.formError = err.error?.message || 'Une erreur est survenue.';
      }
    });
  }

  // ── Suppression ──
  openDelete(d: Directeur) { this.toDelete = d; }

  deleteConfirmed() {
    this.service.delete(this.toDelete!.id!).subscribe(() => {
      this.toDelete = null;
      this.load();
      this.loadRegions();
    });
  }
}
