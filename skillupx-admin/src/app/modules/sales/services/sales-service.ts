import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Lead {
  lead_id: number;
  email: string;
  name: string;
  phone: string;
  subject: string;
  created_at: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {

  private baseURL = environment.apiUrl; // update if needed

  constructor(private http: HttpClient) {}

  getAllLeads(): Observable<{ leads: Lead[] }> {
    return this.http.get<{ leads: Lead[] }>(this.baseURL+"/leads");
  }
}
