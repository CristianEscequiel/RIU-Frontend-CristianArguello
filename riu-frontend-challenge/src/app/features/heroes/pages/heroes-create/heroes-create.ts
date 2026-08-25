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
  templateUrl: './heroes-create.html',
  styleUrl: './heroes-create.scss',
})
export class HeroesCreate {
  private readonly heroesService = inject(HeroesService);
  private readonly messageService = inject(MessageService);
  private activateRoute = inject(Router)

  onSubmit(heroe: HeroCreateRequest): void {

    const heroeData: HeroCreateRequest = heroe;
    this.heroesService.create(heroeData).subscribe({
      next: () => {
        this.messageService.showSuccess('Heroe creado con éxito!!.');
        this.navigateToHeroesList()
      },
      error: (error) => {
        console.error('Error al crear heroe', error);
      },
    });
  }
  navigateToHeroesList(): void {
    this.activateRoute.navigate(['/heroes']);
  }
}
