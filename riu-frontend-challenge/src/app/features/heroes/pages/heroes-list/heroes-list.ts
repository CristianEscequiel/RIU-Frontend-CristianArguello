import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HeroesService } from '../../data-access/heroes.service';
import { MessageService } from '../../../../core/services/message.service';
import { Router } from '@angular/router';
import { Hero } from '../../models/hero.model';
import { Button } from '../../../../shared/components/button/button';
import { Modal } from '../../../../shared/components/modal/modal';
import { Alert } from '../../../../shared/components/alert/alert';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-heroes-list',
  imports: [Button , Modal , Alert , ReactiveFormsModule],
  templateUrl: './heroes-list.html',
  styleUrl: './heroes-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesList implements OnInit{
  private readonly destroyRef = inject(DestroyRef)
  private readonly route = inject(Router);
  private readonly heroesService = inject(HeroesService);
  private readonly messageService = inject(MessageService)
  readonly heroes = signal<Hero[]>([]);
  readonly error = signal<string | null>(null);
  readonly isModalOpen = signal<boolean>(false)
  readonly searchControl = new FormControl('', { nonNullable: true });
  idHeroeDelete = signal<number>(0)


  ngOnInit(): void {
    this.loadHeroes();
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value =>
        this.heroesService.searchByName(value.trim())
      ),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(heroes => {
      this.heroes.set(heroes);
    });
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
  editHeroe(id: number): void {
    this.route.navigate(['/heroes', id, 'edit'], {
      state: { id }
    });
  }
  navigateToCreateHeroe(): void {
    this.route.navigate(['/heroes/new']);
  }
  readonly deleteModalOpen = signal(false);

  openDeleteModal(id:number): void {
    this.deleteModalOpen.set(true);
    this.idHeroeDelete.set(id)
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
