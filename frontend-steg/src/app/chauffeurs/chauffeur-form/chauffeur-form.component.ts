import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chauffeur } from '../../models/chauffeur.model';
import { ChauffeurService } from '../../services/chauffeur.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chauffeur-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h1>{{ isEdit ? 'Modifier' : 'Ajouter' }} un chauffeur</h1>
    <div class="form-card" style="margin-top:24px; max-width:860px">
      <div class="alert-error" *ngIf="errorMsg">{{ errorMsg }}</div>

      <div class="form-grid">
        <div class="form-group">
          <label>Nom <span class="req">*</span></label>
          <input [(ngModel)]="c.nom" [class.invalid]="sub && !c.nom" placeholder="Ben-Salah" />
          <span class="ferr" *ngIf="sub && !c.nom">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>Prénom <span class="req">*</span></label>
          <input [(ngModel)]="c.prenom" [class.invalid]="sub && !c.prenom" placeholder="Ahmed" />
          <span class="ferr" *ngIf="sub && !c.prenom">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>CIN <span class="req">*</span></label>
          <input [(ngModel)]="c.cin" [class.invalid]="sub && !cinOk()" placeholder="08123456" maxlength="8" />
          <span class="ferr" *ngIf="sub && !c.cin">Champ obligatoire</span>
          <span class="ferr" *ngIf="sub && c.cin && !cinOk()">8 chiffres requis</span>
        </div>
        <div class="form-group">
          <label>Téléphone <span class="req">*</span></label>
          <input [(ngModel)]="c.telephone" [class.invalid]="sub && !c.telephone" placeholder="+216 22 111 333" />
          <span class="ferr" *ngIf="sub && !c.telephone">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>Date de naissance <span class="req">*</span></label>
          <input type="date" [(ngModel)]="c.dateNaissance" [class.invalid]="sub && !c.dateNaissance" />
          <span class="ferr" *ngIf="sub && !c.dateNaissance">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>N° de permis <span class="req">*</span></label>
          <input [(ngModel)]="c.numeroPermis" [class.invalid]="sub && !c.numeroPermis" placeholder="TN-445521" />
          <span class="ferr" *ngIf="sub && !c.numeroPermis">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>Date d'obtention du permis <span class="req">*</span></label>
          <input type="date" [(ngModel)]="c.dateObtentionPermis" [class.invalid]="sub && !c.dateObtentionPermis" />
          <span class="ferr" *ngIf="sub && !c.dateObtentionPermis">Champ obligatoire</span>
        </div>
        <div class="form-group">
          <label>Date d'expiration du permis <span class="req">*</span></label>
          <input type="date" [(ngModel)]="c.dateExpirationPermis" [class.invalid]="sub && dateExpErr()" />
          <span class="ferr" *ngIf="sub && !c.dateExpirationPermis">Champ obligatoire</span>
          <span class="ferr" *ngIf="sub && c.dateExpirationPermis && c.dateObtentionPermis && dateExpErr()">
            Doit être postérieure à la date d'obtention
          </span>
        </div>
        <div class="form-group">
          <label>Région</label>
          <ng-container *ngIf="regionDR">
            <input [value]="regionDR" disabled
              style="background:#f0f4f8;color:#666;cursor:not-allowed" />
            <span style="font-size:11px;color:#aaa;margin-top:3px;display:block">
              Affectée automatiquement à votre région
            </span>
          </ng-container>
          <ng-container *ngIf="!regionDR">
            <input [(ngModel)]="c.region" placeholder="Tunis" />
          </ng-container>
        </div>
        <div class="form-group">
          <label>État</label>
          <select [(ngModel)]="c.etat">
            <option value="DISPONIBLE">Disponible</option>
            <option value="EN_MISSION">En mission</option>
            <option value="INDISPONIBLE">Indisponible</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>
      </div>

      <div class="form-group" style="margin-top:16px">
        <label>Photo</label>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:52px;height:52px;border-radius:50%;background:#ddd;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:12px;color:#888">
            <img *ngIf="photoPreview" [src]="photoPreview" style="width:100%;height:100%;object-fit:cover" alt="photo" />
            <span *ngIf="!photoPreview">Photo</span>
          </div>
          <label class="btn btn-outline-secondary" style="cursor:pointer;margin:0">
            Choisir une photo
            <input type="file" accept="image/*" (change)="onPhoto($event)" style="display:none" />
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-cancel" routerLink="/chauffeurs">Annuler</button>
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
export class ChauffeurFormComponent implements OnInit {
  c: Chauffeur = { nom:'', prenom:'', cin:'', telephone:'', dateNaissance:'', numeroPermis:'', dateObtentionPermis:'', dateExpirationPermis:'', region:'', etat:'DISPONIBLE' };
  isEdit = false; sub = false; saving = false; errorMsg = ''; photoPreview = '';
  regionDR: string | null = null;

  constructor(
    private service: ChauffeurService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupère la région du DR connecté
    this.regionDR = this.auth.currentUser?.regionNom ?? null;

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.getById(+id).subscribe(x => { this.c = x; if (x.photo) this.photoPreview = x.photo; });
    }
  }

  cinOk(): boolean { return /^\d{8}$/.test(this.c.cin); }

  dateExpErr(): boolean {
    if (!this.c.dateExpirationPermis || !this.c.dateObtentionPermis) return false;
    return new Date(this.c.dateExpirationPermis) <= new Date(this.c.dateObtentionPermis);
  }

  onPhoto(e: any) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev: any) => { this.photoPreview = ev.target.result; this.c.photo = ev.target.result; };
    r.readAsDataURL(f);
  }

  save() {
    this.sub = true; this.errorMsg = '';
    if (!this.c.nom || !this.c.prenom || !this.c.cin || !this.cinOk() ||
        !this.c.telephone || !this.c.dateNaissance || !this.c.numeroPermis ||
        !this.c.dateObtentionPermis || !this.c.dateExpirationPermis || this.dateExpErr()) return;
    this.saving = true;
    const obs = this.isEdit ? this.service.update(this.c.id!, this.c) : this.service.create(this.c);
    obs.subscribe({
      next: () => this.router.navigate(['/chauffeurs']),
      error: err => { this.saving = false; this.errorMsg = err.error?.message || 'Une erreur est survenue.'; }
    });
  }
}
