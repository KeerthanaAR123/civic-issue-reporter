import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in
  if (authService.currentUser()) {
    return true; // Allow access
  } else {
    // Not logged in? Redirect to Login page
    router.navigate(['/login']);
    return false; // Block access
  }
};
