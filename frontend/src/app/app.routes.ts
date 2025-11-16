import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { IssueFormComponent } from './components/issue-form/issue-form';
import { MyIssuesComponent } from './components/my-issues/my-issues';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'report-issue', component: IssueFormComponent, canActivate: [authGuard] },
  { path: 'my-issues', component: MyIssuesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
