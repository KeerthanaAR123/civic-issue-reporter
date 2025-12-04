import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api/issues'; 

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({ 'x-auth-token': token || '' })
    };
  }

  getIssues(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  createIssue(issueData: FormData): Observable<any> {
    // Don't send Content-Type header for FormData - let browser set it with boundary
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'x-auth-token': token || '' });
    return this.http.post(this.apiUrl, issueData, { headers });
  }

  deleteIssue(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id, this.getHeaders());
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id + '/status', { status }, this.getHeaders());
  }
}
