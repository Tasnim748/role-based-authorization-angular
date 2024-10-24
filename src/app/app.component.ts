import { Component } from '@angular/core';

import { MainNavComponent } from './main-nav/main-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MainNavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bdcom-test';
}
