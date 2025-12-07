import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  tap,
  throwError,
} from "rxjs";
import { environment } from "../../../environments/environtment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

// ----------- INTERFACES -----------
export interface UserInfo {
  name: string;
  email: string;
  username?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserInfo;
}

@Injectable({
  providedIn: "root",
})
export class CommonService {
  private apiUrl = environment.apiUrl;

  // ---------- STATE MANAGEMENT ----------
  $userInfo = new BehaviorSubject<Partial<UserInfo>>({});
  $isLoggedIn = new BehaviorSubject<boolean>(false);
  $username = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) {
  }


  // -------------------------------------
  // Helper: build auth options (headers) if token present
  // -------------------------------------
  private authOptions(): { headers?: HttpHeaders } {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }


  saveLead(payload: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    source: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/leads`; // your lead-sheet endpoint
    return this.http.post(url, payload, this.authOptions()).pipe(
      catchError((err) => {
        console.error("Lead save failed:", err);
        return throwError(() => err);
      })
    );
  }
}
