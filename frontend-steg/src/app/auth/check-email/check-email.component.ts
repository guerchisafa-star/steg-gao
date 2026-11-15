import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  .form-box h2 { font-size: 26px; font-weight: 700; color: #111; margin: 0 0 10px; }
  .form-sub { font-size: 14px; color: #666; margin: 0 0 28px; line-height: 1.7; }
  .submit-btn {
    width: 100%; padding: 13px; background: #1a3a8f; color: white;
    border: none; border-radius: 8px; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: background .15s;
  }
  .submit-btn:hover { background: #142e72; }
`;

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
        <div class="form-box" style="text-align:center">

          <div class="mail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" stroke-width="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <h2>Vérifiez votre Gmail</h2>
          <p class="form-sub">
            Nous avons envoyé un lien de réinitialisation à<br>
            <strong>{{ email }}</strong><br>
            Consultez votre boîte de réception.
          </p>

          <a routerLink="/login" class="submit-btn" style="display:block;text-decoration:none;text-align:center">
            Ouvrir ma boîte mail
          </a>

          <div class="back-row">
            <a routerLink="/login" class="back-link">← Retour à la connexion</a>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [SHARED_STYLES + `
    .mail-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: #eef2ff; margin: 0 auto 24px;
      display: flex; align-items: center; justify-content: center;
    }
    .mail-icon svg { width: 36px; height: 36px; }
    .back-row { text-align: center; margin-top: 18px; }
    .back-link { font-size: 13px; color: #1a3a8f; text-decoration: none; font-weight: 500; }
    .back-link:hover { text-decoration: underline; }
  `]
})
export class CheckEmailComponent implements OnInit {
  email = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || 'votre adresse email';
  }
}
