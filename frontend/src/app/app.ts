import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1 style="padding:16px"></h1>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {}
