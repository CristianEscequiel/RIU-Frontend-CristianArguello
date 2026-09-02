import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from '../../data-access/heroes.service';
import { Hero, HeroCreateRequest } from '../../models/hero.model';
import { MessageService } from '../../../../core/services/message.service';
import { Button } from '../../../../shared/components/button/button';
import { HeroesForm } from '../../components/heroes-form/heroes-form';

@Component({
  selector: 'app-heroes-edit',
  imports: [Button , HeroesForm],
  templateUrl: './heroes-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesEdit implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router)
  private readonly _heroesService = inject(HeroesService);
  private readonly _messageService = inject(MessageService)

  hero = signal<Hero | null>(null);

  ngOnInit() {
    const id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    if (!id) return;

    this._heroesService.getById(id).subscribe({
      next: hero => this.hero.set(hero),
      error: () => this._messageService.showError('No se pudo cargar el superhéroe.')
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
      ...hero
    };

    this._heroesService.update(current.id, updatedHero).subscribe({
      next: (updated) => {
        this.hero.set(updated);
        this._messageService.showSuccess(
          'Superheroe actualizado/a correctamente'
        );
        this.navigateToHeroesList()
      },
      error: () => {
        this._messageService.showError(
          'Error actualizando al superheroe'
        );
      }
    });
  }
  navigateToHeroesList(): void {
    this._router.navigate(['/heroes']);
  }

}
