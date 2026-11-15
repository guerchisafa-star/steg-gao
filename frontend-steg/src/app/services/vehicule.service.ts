import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule, VehiculeEtat } from '../models/vehicule.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehiculeService {
  private apiUrl = `${environment.apiUrl}/vehicules`;

  constructor(private http: HttpClient) {}

  getAll(search?: string, etat?: VehiculeEtat): Observable<Vehicule[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (etat)   params.push(`etat=${etat}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<Vehicule[]>(url);
  }

  getById(id: number): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.apiUrl}/${id}`);
  }

  create(v: Vehicule): Observable<Vehicule> {
    return this.http.post<Vehicule>(this.apiUrl, v);
  }

  update(id: number, v: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/${id}`, v);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateEtat(id: number, etat: VehiculeEtat): Observable<Vehicule> {
    return this.http.patch<Vehicule>(`${this.apiUrl}/${id}/etat?etat=${etat}`, {});
  }
}
