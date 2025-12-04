import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api/admin';

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({ 'x-auth-token': token || '' })
    };
  }

  getAllIssues(category?: string, status?: string): Observable<any[]> {
    let url = this.apiUrl + '/issues';
    const params: any = {};
    if (category) params.category = category;
    if (status) params.status = status;
    
    if (Object.keys(params).length > 0) {
      url += '?' + new URLSearchParams(params).toString();
    }
    return this.http.get<any[]>(url, this.getHeaders());
  }

  getStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/stats', this.getHeaders());
  }

  getIssuesByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/category/' + category, this.getHeaders());
  }

  updateIssueStatus(id: string, status: string): Observable<any> {
    return this.http.patch(this.apiUrl + '/issues/' + id + '/status', { status }, this.getHeaders());
  }

  addAdminResponse(id: string, response: string): Observable<any> {
    return this.http.patch(this.apiUrl + '/issues/' + id + '/response', { adminResponse: response }, this.getHeaders());
  }

  deleteIssue(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/issues/' + id, this.getHeaders());
  }
}

