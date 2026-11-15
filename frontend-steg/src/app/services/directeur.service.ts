import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Directeur } from '../models/directeur.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DirecteurService {
  private apiUrl = `${environment.apiUrl}/directeurs`;

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Directeur[]> {
    const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
    return this.http.get<Directeur[]>(url);
  }

  getById(id: number): Observable<Directeur> {
    return this.http.get<Directeur>(`${this.apiUrl}/${id}`);
  }

  create(d: Directeur): Observable<Directeur> {
    return this.http.post<Directeur>(this.apiUrl, d);
  }

  update(id: number, d: Directeur): Observable<Directeur> {
    return this.http.put<Directeur>(`${this.apiUrl}/${id}`, d);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  affecter(directeurId: number, regionId: number): Observable<Directeur> {
    return this.http.patch<Directeur>(`${this.apiUrl}/${directeurId}/affecter/${regionId}`, {});
  }

  desaffecter(directeurId: number): Observable<Directeur> {
    return this.http.patch<Directeur>(`${this.apiUrl}/${directeurId}/desaffecter`, {});
  }
}
