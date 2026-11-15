import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="placeholder-icon">🚧</div>
      <h2>{{ title }}</h2>
      <p>Cette section est en cours de développement.</p>
    </div>
  `,
  styles: [`
    .placeholder-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 12px;
      color: #888;
    }
    .placeholder-icon { font-size: 48px; }
    h2 { font-size: 20px; font-weight: 600; color: #1a3a6b; }
    p  { font-size: 14px; }
  `]
})
export class PlaceholderComponent {
  title = '';

  constructor(private route: ActivatedRoute) {
    // Récupère le titre depuis les données de la route
    this.route.data.subscribe(d => this.title = d['title'] ?? 'Page');
  }
}
