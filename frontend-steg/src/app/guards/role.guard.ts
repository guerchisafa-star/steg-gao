import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth   = inject(AuthService);
    const router = inject(Router);
    if (allowedRoles.includes(auth.role)) return true;
    if (auth.isDirecteurRegional())     router.navigate(['/chauffeurs']);
    else if (auth.isDirecteurGeneral()) router.navigate(['/regions']);
    else                                router.navigate(['/login']);
    return false;
  };
}
