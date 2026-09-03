import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly _router = inject(Router);

  onViewAll() {
    this._router.navigate(['/heroes']);
  }
  onCreateHero() {
    this._router.navigate(['/heroes/new']);
  }
}
