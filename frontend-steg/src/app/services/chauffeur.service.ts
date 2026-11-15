import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chauffeur, ChauffeurEtat } from '../models/chauffeur.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChauffeurService {
  private apiUrl = `${environment.apiUrl}/chauffeurs`;

  constructor(private http: HttpClient) {}

  getAll(search?: string, etat?: ChauffeurEtat): Observable<Chauffeur[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (etat)   params.push(`etat=${etat}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<Chauffeur[]>(url);
  }

  getById(id: number): Observable<Chauffeur> {
    return this.http.get<Chauffeur>(`${this.apiUrl}/${id}`);
  }

  create(c: Chauffeur): Observable<Chauffeur> {
    return this.http.post<Chauffeur>(this.apiUrl, c);
  }

  update(id: number, c: Chauffeur): Observable<Chauffeur> {
    return this.http.put<Chauffeur>(`${this.apiUrl}/${id}`, c);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
