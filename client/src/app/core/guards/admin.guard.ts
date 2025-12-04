import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in AND is admin
  const user = authService.currentUser();
  if (user && user.user && user.user.role === 'admin') {
    return true; // Allow access
  } else {
    // Not admin? Redirect to dashboard
    router.navigate(['/dashboard']);
    return false; // Block access
  }
};
