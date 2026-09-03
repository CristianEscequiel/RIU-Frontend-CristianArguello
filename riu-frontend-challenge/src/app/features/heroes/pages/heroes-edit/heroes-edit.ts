import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from '../../data-access/heroes.service';
import { Hero, HeroCreateRequest } from '../../models/hero.model';
import { MessageService } from '../../../../core/services/message.service';
import { Button } from '../../../../shared/components/button/button';
import { HeroesForm } from '../../components/heroes-form/heroes-form';

@Component({
  selector: 'app-heroes-edit',
  imports: [Button, HeroesForm],
  templateUrl: './heroes-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesEdit implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _heroesService = inject(HeroesService);
  private readonly _messageService = inject(MessageService);

  hero = signal<Hero | null>(null);

  ngOnInit() {
    const paramId = this._activatedRoute.snapshot.paramMap.get('id');
    const id = Number(paramId);

    if (!paramId || !Number.isInteger(id) || id <= 0) {
      this._messageService.showError('El héroe solicitado no es válido.');
      this.navigateToHeroesList();
      return;
    }

    this._heroesService.getById(id).subscribe({
      next: (hero) => this.hero.set(hero),
      error: () => {
        this._messageService.showError('El héroe solicitado no existe.');
        this.navigateToHeroesList();
      },
    });
  }
  onSubmitEdit(hero: HeroCreateRequest): void {
    const current = this.hero();

    if (!current) return;

    const hasChanges =
      current.name !== hero.name ||
      current.superpower !== hero.superpower ||
      current.weakness !== hero.weakness ||
      current.enemy !== hero.enemy;

    if (!hasChanges) {
      this._messageService.showWarning('No hubo cambios en tu superheroe');
      return;
    }

    const updatedHero: Hero = {
      ...current,
      ...hero,
    };

    this._heroesService.update(current.id, updatedHero).subscribe({
      next: (updated) => {
        this.hero.set(updated);
        this._messageService.showSuccess('Superheroe actualizado/a correctamente');
        this.navigateToHeroesList();
      },
      error: () => {
        this._messageService.showError('Error actualizando al superheroe');
      },
    });
  }
  navigateToHeroesList(): void {
    this._router.navigate(['/heroes']);
  }
}
