import { Component, inject } from '@angular/core';
import { HeroesForm } from '../../components/heroes-form/heroes-form';
import { Button } from '../../../../shared/components/button/button';
import { HeroesService } from '../../data-access/heroes.service';
import { MessageService } from '../../../../core/services/message.service';
import { Router } from '@angular/router';
import { HeroCreateRequest } from '../../models/hero.model';

@Component({
  selector: 'app-heroes-create',
  imports: [HeroesForm , Button] ,
  templateUrl: './heroes-create.html'
})
export class HeroesCreate {
  private readonly _heroesService = inject(HeroesService);
  private readonly _messageService = inject(MessageService);
  private readonly _router = inject(Router)

  onSubmit(hero: HeroCreateRequest): void {
    this._heroesService.create(hero).subscribe({
      next: () => {
        this._messageService.showSuccess('Heroe creado con éxito!!.');
        this.navigateToHeroesList()
      },
      error: () => {
        this._messageService.showError('No se pudo crear el superheroe.');
      },
    });
  }
  navigateToHeroesList(): void {
    this._router.navigate(['/heroes']);
  }
}
