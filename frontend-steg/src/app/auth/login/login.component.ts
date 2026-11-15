import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-layout">

      <!-- ── Panneau gauche bleu ── -->
      <div class="left-panel">
        <div class="brand">
          <div class="brand-icon">S</div>
          <h1>STEG / GAO</h1>
          <p class="brand-sub">Gestion des missions et du parc automobile</p>
          <ul class="brand-features">
            <li>Suivi GPS des missions en temps réel</li>
            <li>Gestion des chauffeurs et des véhicules</li>
            <li>Carburant, réclamations et historique</li>
          </ul>
        </div>
      </div>

      <!-- ── Panneau droit blanc ── -->
      <div class="right-panel">
        <div class="form-box">
          <h2>Connexion</h2>
          <p class="form-sub">Accédez à votre espace avec votre identifiant.</p>

          <form (ngSubmit)="login()">
            <div class="field">
              <label>Email / identifiant</label>
              <input type="text" [(ngModel)]="username" name="username"
                placeholder="nom@steg.com.tn"
                [class.field-error]="error" />
            </div>

            <div class="field">
              <label>Mot de passe</label>
              <div class="pwd-wrap">
                <input [type]="showPwd ? 'text' : 'password'"
                  [(ngModel)]="password" name="password"
                  placeholder="••••••••"
                  [class.field-error]="error" />
                <button type="button" class="eye-btn" (click)="showPwd = !showPwd"
                  [attr.aria-label]="showPwd ? 'Masquer' : 'Afficher'">
                  <svg *ngIf="!showPwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showPwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="forgot-row">
              <a routerLink="/mot-de-passe-oublie" class="forgot-link">Mot de passe oublié ?</a>
            </div>

            <div class="err-msg" *ngIf="error">{{ error }}</div>

            <button type="submit" class="submit-btn" [disabled]="loading">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>

            <p class="reset-hint">
              Un lien de réinitialisation sera envoyé à votre adresse Gmail.
            </p>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ── Layout ── */
    .auth-layout {
      display: flex;
      min-height: 100vh;
    }

    /* ── Panneau gauche ── */
    .left-panel {
      width: 42%;
      background: #1a3a8f;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 40px;
      flex-shrink: 0;
    }

    .brand { color: white; }

    .brand-icon {
      width: 52px; height: 52px;
      background: #f5a623;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; font-weight: 800; color: white;
      margin-bottom: 20px;
    }

    .brand h1 {
      font-size: 28px; font-weight: 800;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
    }

    .brand-sub {
      font-size: 15px;
      color: rgba(255,255,255,0.75);
      margin: 0 0 24px;
    }

    .brand-features {
      list-style: none; padding: 0; margin: 0;
      display: flex; flex-direction: column; gap: 10px;
    }
    .brand-features li {
      font-size: 14px;
      color: rgba(255,255,255,0.80);
      padding-left: 16px;
      position: relative;
    }
    .brand-features li::before {
      content: '•';
      position: absolute; left: 0;
      color: #f5a623;
    }

    /* ── Panneau droit ── */
    .right-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 40px;
      background: white;
    }

    .form-box { width: 100%; max-width: 380px; }

    .form-box h2 {
      font-size: 26px; font-weight: 700;
      color: #111; margin: 0 0 6px;
    }

    .form-sub {
      font-size: 14px; color: #888;
      margin: 0 0 28px;
    }

    /* ── Champs ── */
    .field {
      display: flex; flex-direction: column; gap: 6px;
      margin-bottom: 18px;
    }
    .field label {
      font-size: 13px; font-weight: 500; color: #333;
    }
    .field input {
      padding: 11px 14px;
      border: 1.5px solid #d8dce2;
      border-radius: 8px;
      font-size: 14px; color: #111;
      transition: border-color .15s;
      outline: none; width: 100%;
    }
    .field input:focus { border-color: #1a3a8f; }
    .field input::placeholder { color: #bbb; }
    .field-error { border-color: #e53935 !important; }

    /* ── Mot de passe ── */
    .pwd-wrap { position: relative; }
    .pwd-wrap input { padding-right: 42px; }
    .eye-btn {
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: #aaa; padding: 0;
      display: flex; align-items: center;
    }
    .eye-btn svg { width: 18px; height: 18px; }
    .eye-btn:hover { color: #555; }

    /* ── Lien oublié ── */
    .forgot-row {
      display: flex; justify-content: flex-end;
      margin: -8px 0 20px;
    }
    .forgot-link {
      font-size: 13px; color: #1a3a8f; font-weight: 500;
      text-decoration: none;
    }
    .forgot-link:hover { text-decoration: underline; }

    /* ── Erreur ── */
    .err-msg {
      background: #fff0f0; color: #c62828;
      border: 1px solid #ffcdd2;
      border-radius: 7px; padding: 10px 14px;
      font-size: 13px; margin-bottom: 16px;
    }

    /* ── Bouton ── */
    .submit-btn {
      width: 100%; padding: 13px;
      background: #1a3a8f; color: white;
      border: none; border-radius: 8px;
      font-size: 15px; font-weight: 600;
      cursor: pointer; transition: background .15s;
    }
    .submit-btn:hover:not(:disabled) { background: #142e72; }
    .submit-btn:disabled { opacity: .65; cursor: not-allowed; }

    /* ── Hint bas ── */
    .reset-hint {
      text-align: center; font-size: 12px;
      color: #aaa; margin-top: 14px;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  showPwd = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    if (!this.username || !this.password) {
      this.error = 'Veuillez saisir votre identifiant et mot de passe.';
      return;
    }
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user.role === 'DIRECTEUR_GENERAL') this.router.navigate(['/regions']);
        else                                    this.router.navigate(['/chauffeurs']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Identifiant ou mot de passe incorrect.';
      }
    });
  }
}
