import { Component, inject } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
private readonly route = inject(Router)
onViewAll() {
  this.route.navigate(['/heroes'])
}
onCreateHero() {
  this.route.navigate(['/heroes/new'])
}
}
