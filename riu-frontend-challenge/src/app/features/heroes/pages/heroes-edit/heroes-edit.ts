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
  styleUrl: './heroes-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesEdit implements OnInit {
  private readonly router = inject(ActivatedRoute);
  private readonly route = inject(Router)
  private readonly heroesService = inject(HeroesService);
  private readonly messageService = inject(MessageService)

  heroe = signal<Hero | null>(null);

  ngOnInit() {
    const id = Number(this.router.snapshot.paramMap.get('id'));

    if (!id) return;

    this.heroesService.getById(id).subscribe({
      next: heroe => this.heroe.set(heroe),
      error: error => this.messageService.showError(error)
    });
  }
  onSubmitEdit(heroe: HeroCreateRequest): void {
    const current = this.heroe();

    if (!current) return;

    const hasChanges =
      current.name !== heroe.name ||
      current.superpower !== heroe.superpower ||
      current.weakness !== heroe.weakness ||
      current.enemy !== heroe.enemy;

    if (!hasChanges) {
      this.messageService.showWarning('No hubo cambios en tu superheroe');
      return;
    }

    const updatedWorkOrder: Hero = {
      ...current,
      ...heroe
    };

    this.heroesService.update(current.id, updatedWorkOrder).subscribe({
      next: (updated) => {
        this.heroe.set(updated);
        this.messageService.showSuccess(
          'Superheroe actualizado/a correctamente'
        );
      },
      error: (error) => {
        this.messageService.showError(
          'Error actualizando al superheroe'
        );
      }
    });
  }
  navigateToHeroesList(): void {
    this.route.navigate(['/heroes']);
  }

}
