import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

const DG   = ['DIRECTEUR_GENERAL'];
const BOTH = ['DIRECTEUR_GENERAL', 'DIRECTEUR_REGIONAL'];

export const routes: Routes = [

  // ── Public ──
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'mot-de-passe-oublie', loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'verifier-email', loadComponent: () => import('./auth/check-email/check-email.component').then(m => m.CheckEmailComponent) },
  { path: 'reinitialiser-mot-de-passe', loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ── Directeur Général : Régions ──
  { path: 'regions',          canActivate: [authGuard, roleGuard(DG)],   loadComponent: () => import('./regions/region-list/region-list.component').then(m => m.RegionListComponent) },
  { path: 'regions/new',      canActivate: [authGuard, roleGuard(DG)],   loadComponent: () => import('./regions/region-form/region-form.component').then(m => m.RegionFormComponent) },
  { path: 'regions/:id/edit', canActivate: [authGuard, roleGuard(DG)],   loadComponent: () => import('./regions/region-form/region-form.component').then(m => m.RegionFormComponent) },
  { path: 'regions/:id',      canActivate: [authGuard, roleGuard(DG)],   loadComponent: () => import('./regions/region-detail/region-detail.component').then(m => m.RegionDetailComponent) },

  // ── Directeur Général : Directeurs ──
  { path: 'directeurs',       canActivate: [authGuard, roleGuard(DG)],   loadComponent: () => import('./directeurs/directeur-list/directeur-list.component').then(m => m.DirecteurListComponent) },

  // ── Chauffeurs ──
  { path: 'chauffeurs',          canActivate: [authGuard, roleGuard(BOTH)], loadComponent: () => import('./chauffeurs/chauffeur-list/chauffeur-list.component').then(m => m.ChauffeurListComponent) },
  { path: 'chauffeurs/new',      canActivate: [authGuard, roleGuard(BOTH)], loadComponent: () => import('./chauffeurs/chauffeur-form/chauffeur-form.component').then(m => m.ChauffeurFormComponent) },
  { path: 'chauffeurs/:id/edit', canActivate: [authGuard, roleGuard(BOTH)], loadComponent: () => import('./chauffeurs/chauffeur-form/chauffeur-form.component').then(m => m.ChauffeurFormComponent) },
  { path: 'chauffeurs/:id',      canActivate: [authGuard, roleGuard(BOTH)], loadComponent: () => import('./chauffeurs/chauffeur-detail/chauffeur-detail.component').then(m => m.ChauffeurDetailComponent) },

  // ── Véhicules ──
  { path: 'vehicules',          canActivate: [authGuard, roleGuard(BOTH)], loadComponent: () => import('./vehicules/vehicule-list/vehicule-list.component').then(m => m.VehiculeListComponent) },
  { path: 'vehicules/new',      canActivate: [authGuard, roleGuard(BOTH)], loadComponent: () => import('./vehicules/vehicule-form/vehicule-form.component').then(m => m.VehiculeFormComponent) },
  { path: 'vehicules/:id/edit', canActivate: [authGuard, roleGuard(BOTH)], loadComponent: () => import('./vehicules/vehicule-form/vehicule-form.component').then(m => m.VehiculeFormComponent) },
  { path: 'vehicules/:id',      canActivate: [authGuard, roleGuard(BOTH)], loadComponent: () => import('./vehicules/vehicule-detail/vehicule-detail.component').then(m => m.VehiculeDetailComponent) },

  // ── Fallback ──
  { path: '**', canActivate: [authGuard], loadComponent: () => import('./shared/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Page introuvable' } }
];
