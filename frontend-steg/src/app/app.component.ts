import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <ng-container *ngIf="isPublicPage; else appLayout">
      <router-outlet></router-outlet>
    </ng-container>

    <ng-template #appLayout>
      <div class="layout">
        <aside class="sidebar">
          <div class="logo">
            <span class="steg">STEG</span> / <span class="gao">GAO</span>
          </div>

          <!-- Menu Directeur Général -->
          <nav *ngIf="auth.isDirecteurGeneral()">
            <a routerLink="/regions"    routerLinkActive="active">Régions</a>
            <a routerLink="/directeurs" routerLinkActive="active">Directeurs</a>
          </nav>

          <!-- Menu Directeur Régional -->
          <nav *ngIf="auth.isDirecteurRegional()">
            <div class="region-badge" *ngIf="auth.currentUser?.regionNom">
              <span class="region-label">Ma région</span>
              <span class="region-name">{{ auth.currentUser?.regionNom }}</span>
            </div>
            <div class="region-badge region-none" *ngIf="!auth.currentUser?.regionNom">
              <span class="region-label">⚠ Aucune région affectée</span>
            </div>
            <a routerLink="/chauffeurs" routerLinkActive="active">Chauffeurs</a>
            <a routerLink="/vehicules"  routerLinkActive="active">Véhicules</a>
          </nav>

          <!-- Infos utilisateur + déconnexion -->
          <div class="sidebar-footer" *ngIf="auth.currentUser">
            <div class="user-info">
              <div class="user-avatar">
                {{ auth.currentUser.prenom.charAt(0) }}{{ auth.currentUser.nom.charAt(0) }}
              </div>
              <div class="user-name">
                <span>{{ auth.currentUser.prenom }} {{ auth.currentUser.nom }}</span>
                <small>{{ auth.isDirecteurGeneral() ? 'Dir. Général' : 'Dir. Régional' }}</small>
              </div>
            </div>
            <button class="logout-btn" (click)="logout()">Déconnexion</button>
          </div>
        </aside>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </ng-template>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }

    .sidebar {
      width: 200px;
      background: #1a3a6b;
      color: white;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .logo {
      padding: 20px 16px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid rgba(255,255,255,0.12);
    }
    .steg { color: white; }
    .gao  { color: #e8824a; }

    nav { display: flex; flex-direction: column; padding-top: 8px; flex: 1; }
    nav a {
      color: rgba(255,255,255,0.82);
      text-decoration: none;
      padding: 12px 16px;
      font-size: 14px;
      transition: background 0.1s;
    }
    nav a:hover  { background: rgba(255,255,255,0.1); }
    nav a.active { background: #2a5298; color: white; font-weight: 500; }

    .region-badge {
      margin: 8px 10px 4px;
      padding: 8px 10px;
      background: rgba(255,255,255,0.1);
      border-radius: 7px;
      border-left: 3px solid #e8824a;
    }
    .region-label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 2px;
    }
    .region-name { font-size: 13px; font-weight: 600; color: white; }
    .region-none { border-left-color: #e74c3c; }
    .region-none .region-label { color: #e74c3c; font-size: 11px; text-transform: none; letter-spacing: 0; }

    .sidebar-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,0.12); }
    .user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .user-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 600; flex-shrink: 0; text-transform: uppercase;
    }
    .user-name { display: flex; flex-direction: column; font-size: 12px; overflow: hidden; }
    .user-name span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
    .user-name small { color: rgba(255,255,255,0.6); }

    .logout-btn {
      width: 100%; padding: 8px;
      background: rgba(255,255,255,0.1); color: white;
      border: 1px solid rgba(255,255,255,0.2); border-radius: 6px;
      cursor: pointer; font-size: 13px; transition: background 0.15s;
    }
    .logout-btn:hover { background: rgba(255,255,255,0.2); }

    .content { flex: 1; padding: 32px; background: #f0f4f8; min-height: 100vh; }
  `]
})
export class AppComponent implements OnInit {

  isPublicPage = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url: string = e.urlAfterRedirects;
      this.isPublicPage = url === '/login'
        || url.startsWith('/mot-de-passe-oublie')
        || url.startsWith('/verifier-email')
        || url.startsWith('/reinitialiser-mot-de-passe');
    });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => { this.auth.clearUser(); this.router.navigate(['/login']); }
    });
  }
}
