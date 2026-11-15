import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const SHARED_STYLES = `
  .auth-layout { display: flex; min-height: 100vh; }
  .left-panel {
    width: 42%; background: #1a3a8f;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 40px; flex-shrink: 0;
  }
  .brand { color: white; }
  .brand-icon {
    width: 52px; height: 52px; background: #f5a623; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 800; color: white; margin-bottom: 20px;
  }
  .brand h1 { font-size: 28px; font-weight: 800; margin: 0 0 10px; }
  .brand-sub { font-size: 15px; color: rgba(255,255,255,.75); margin: 0; }
  .right-panel {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 48px 40px; background: white;
  }
  .form-box { width: 100%; max-width: 380px; }
  .form-box h2 { font-size: 26px; font-weight: 700; color: #111; margin: 0 0 6px; }
  .form-sub { font-size: 14px; color: #888; margin: 0 0 28px; line-height: 1.6; }
  .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
  .field label { font-size: 13px; font-weight: 500; color: #333; }
  .field input {
    padding: 11px 14px; border: 1.5px solid #d8dce2; border-radius: 8px;
    font-size: 14px; color: #111; outline: none; width: 100%;
    transition: border-color .15s;
  }
  .field input:focus { border-color: #1a3a8f; }
  .field input::placeholder { color: #bbb; }
  .field-error { border-color: #e53935 !important; }
  .submit-btn {
    width: 100%; padding: 13px; background: #1a3a8f; color: white;
    border: none; border-radius: 8px; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: background .15s;
  }
  .submit-btn:hover:not(:disabled) { background: #142e72; }
`;

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-layout">

      <div class="left-panel">
        <div class="brand">
          <div class="brand-icon">S</div>
          <h1>STEG / GAO</h1>
          <p class="brand-sub">Gestion des missions et du parc automobile</p>
        </div>
      </div>

      <div class="right-panel">
        <div class="form-box">
          <h2>Nouveau mot de passe</h2>
          <p class="form-sub">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>

          <div class="success-msg" *ngIf="success">
            Mot de passe réinitialisé !
            <a routerLink="/login">Se connecter →</a>
          </div>

          <form (ngSubmit)="submit()" *ngIf="!success">
            <div class="field">
              <label>Nouveau mot de passe</label>
              <div class="pwd-wrap">
                <input [type]="showNew ? 'text' : 'password'"
                  [(ngModel)]="nouveau" name="nouveau"
                  placeholder="••••••••"
                  [class.field-error]="submitted && nouveau.length < 4" />
                <button type="button" class="eye-btn" (click)="showNew = !showNew">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <span class="ferr" *ngIf="submitted && nouveau.length < 4">
                4 caractères minimum
              </span>
            </div>

            <div class="field">
              <label>Confirmer le mot de passe</label>
              <div class="pwd-wrap">
                <input [type]="showConfirm ? 'text' : 'password'"
                  [(ngModel)]="confirmation" name="confirmation"
                  placeholder="••••••••"
                  [class.field-error]="submitted && nouveau !== confirmation" />
                <button type="button" class="eye-btn" (click)="showConfirm = !showConfirm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <span class="ferr" *ngIf="submitted && nouveau !== confirmation">
                Les mots de passe ne correspondent pas
              </span>
            </div>

            <button type="submit" class="submit-btn">Réinitialiser</button>

            <div class="back-row">
              <a routerLink="/login" class="back-link">← Retour à la connexion</a>
            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [SHARED_STYLES + `
    .ferr { color: #c62828; font-size: 12px; margin-top: 2px; }
    .pwd-wrap { position: relative; }
    .pwd-wrap input { padding-right: 42px; }
    .eye-btn {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; color: #aaa; padding: 0;
      display: flex; align-items: center;
    }
    .eye-btn svg { width: 18px; height: 18px; }
    .eye-btn:hover { color: #555; }
    .success-msg {
      background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;
      border-radius: 8px; padding: 14px 18px; font-size: 14px;
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px;
    }
    .success-msg a { color: #1a3a8f; font-weight: 600; text-decoration: none; }
    .back-row { text-align: center; margin-top: 18px; }
    .back-link { font-size: 13px; color: #1a3a8f; text-decoration: none; font-weight: 500; }
    .back-link:hover { text-decoration: underline; }
  `]
})
export class ResetPasswordComponent {
  nouveau = '';
  confirmation = '';
  submitted = false;
  success = false;
  showNew = false;
  showConfirm = false;

  constructor(private router: Router) {}

  submit() {
    this.submitted = true;
    if (this.nouveau.length < 4 || this.nouveau !== this.confirmation) return;
    this.success = true;
    setTimeout(() => this.router.navigate(['/login']), 2500);
  }
}
