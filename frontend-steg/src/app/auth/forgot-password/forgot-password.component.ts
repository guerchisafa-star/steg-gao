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
  .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
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
  .submit-btn:disabled { opacity: .65; cursor: not-allowed; }
`;

@Component({
  selector: 'app-forgot-password',
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
          <h2>Mot de passe oublié</h2>
          <p class="form-sub">
            Entrez votre adresse email. Nous vous enverrons un lien pour
            réinitialiser votre mot de passe.
          </p>

          <form (ngSubmit)="submit()">
            <div class="field">
              <label>Adresse Email</label>
              <input type="email" [(ngModel)]="email" name="email"
                placeholder="nom@steg.com.tn"
                [class.field-error]="submitted && !emailValid()" />
              <span class="ferr" *ngIf="submitted && !emailValid()">
                Adresse email invalide
              </span>
            </div>

            <button type="submit" class="submit-btn" [disabled]="loading">
              {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
            </button>

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
    .back-row { text-align: center; margin-top: 18px; }
    .back-link { font-size: 13px; color: #1a3a8f; text-decoration: none; font-weight: 500; }
    .back-link:hover { text-decoration: underline; }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  submitted = false;
  loading = false;

  constructor(private router: Router) {}

  emailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  submit() {
    this.submitted = true;
    if (!this.emailValid()) return;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/verifier-email'], { queryParams: { email: this.email } });
    }, 800);
  }
}
