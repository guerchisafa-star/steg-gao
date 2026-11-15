import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Region } from '../models/region.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private apiUrl = `${environment.apiUrl}/regions`;

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Region[]> {
    const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
    return this.http.get<Region[]>(url);
  }

  getById(id: number): Observable<Region> {
    return this.http.get<Region>(`${this.apiUrl}/${id}`);
  }

  create(region: Region): Observable<Region> {
    return this.http.post<Region>(this.apiUrl, region);
  }

  update(id: number, region: Region): Observable<Region> {
    return this.http.put<Region>(`${this.apiUrl}/${id}`, region);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleEtat(id: number): Observable<Region> {
    return this.http.patch<Region>(`${this.apiUrl}/${id}/toggle`, {});
  }
}
