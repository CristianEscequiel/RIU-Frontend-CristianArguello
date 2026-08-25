import { Component, inject, OnInit, signal } from '@angular/core';
import { HeroesService } from '../../data-access/heroes.service';
import { MessageService } from '../../../../core/services/message.service';
import { Router } from '@angular/router';
import { Hero } from '../../models/hero.model';
import { Button } from '../../../../shared/components/button/button';
import { Modal } from '../../../../shared/components/modal/modal';
import { Alert } from '../../../../shared/components/alert/alert';

@Component({
  selector: 'app-heroes-list',
  imports: [Button , Modal , Alert],
  templateUrl: './heroes-list.html',
  styleUrl: './heroes-list.scss',
})
export class HeroesList implements OnInit{
  private readonly route = inject(Router);
  private readonly heroesService = inject(HeroesService);
  private readonly messageService = inject(MessageService)
  readonly heroes = signal<Hero[]>([]);
  readonly error = signal<string | null>(null);
  readonly isModalOpen = signal<boolean>(false)

  ngOnInit() {
    this.loadHeroes();
  }

  loadHeroes(): void {
    this.error.set(null);

    this.heroesService
      .getAll()
      .subscribe({
        next: (heroes) => {
          this.heroes.set(heroes);
        },
        error: () => {
          this.error.set('No se pudieron cargar a los heroes.');
        },
      });
  }
  viewHeroe(id: number): void {
    this.route.navigate(['/heroe', id]);
  }
  editHeroe(id: number): void {
    this.route.navigate(['/heroes', id, 'edit'], {
      state: { id }
    });
  }
  navigateToCreateHeroe(): void {
    this.route.navigate(['/heroes/new']);
  }
  readonly deleteModalOpen = signal(false);

  openDeleteModal(): void {
    this.deleteModalOpen.set(true);
  }

  deleteHeroe(id: number): void {
    this.heroesService.delete(id).subscribe({
      next: () => {
        this.messageService.showSuccess('Heroe eliminado satisfactoriamente.');
        this.loadHeroes();
      },
      error: (error) => {
        this.messageService.showError('Error al eliminar al heroe!')
      },
    });
  }
}
