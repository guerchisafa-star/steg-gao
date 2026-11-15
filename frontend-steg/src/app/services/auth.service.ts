import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserInfo {
  username: string;
  role: 'DIRECTEUR_GENERAL' | 'DIRECTEUR_REGIONAL';
  nom: string;
  prenom: string;
  regionNom?: string;
}

const STORAGE_KEY = 'steg_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<UserInfo | null>(this.loadFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private loadFromStorage(): UserInfo | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  private saveToStorage(user: UserInfo | null): void {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }

  login(username: string, password: string): Observable<UserInfo> {
    return this.http.post<UserInfo>(
      `${this.apiUrl}/login`,
      { username, password },
      { withCredentials: true }
    ).pipe(
      tap(user => { this.userSubject.next(user); this.saveToStorage(user); })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => { this.userSubject.next(null); this.saveToStorage(null); })
    );
  }

  fetchMe(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(user => { this.userSubject.next(user); this.saveToStorage(user); })
    );
  }

  clearUser(): void {
    this.userSubject.next(null);
    this.saveToStorage(null);
  }

  get currentUser(): UserInfo | null { return this.userSubject.value; }
  get isLoggedIn(): boolean          { return this.userSubject.value !== null; }
  get role(): string                 { return this.userSubject.value?.role ?? ''; }

  isDirecteurGeneral(): boolean  { return this.role === 'DIRECTEUR_GENERAL'; }
  isDirecteurRegional(): boolean { return this.role === 'DIRECTEUR_REGIONAL'; }
}
