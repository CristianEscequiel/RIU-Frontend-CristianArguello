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
    private readonly workOrderService = inject(HeroesService);
  private readonly messageService = inject(MessageService);
  private activateRoute = inject(Router)

  onSubmit(heroe: HeroCreateRequest): void {

    const workOrderData: HeroCreateRequest = heroe;
    this.workOrderService.create(workOrderData).subscribe({
      next: (createdHeroe) => {
        this.messageService.showSuccess('Heroe creado con éxito!!.');
        console.log('Heroe creado con éxito!!', createdHeroe);
      },
      error: (error) => {
        console.error('Error al crear heroe', error);
      },
    });
  }
  navigateToWorkOrdersList(): void {
    this.activateRoute.navigate(['/heroes']);
  }
}
