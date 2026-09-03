import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
  imports: [Button, Modal, Alert, ReactiveFormsModule],
  templateUrl: './heroes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesList implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _heroesService = inject(HeroesService);
  private readonly _messageService = inject(MessageService);
  readonly heroes = signal<Hero[]>([]);
  readonly error = signal<string | null>(null);
  readonly isModalOpen = signal<boolean>(false);
  readonly deleteModalOpen = signal(false);
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly heroIdToDelete = signal<number>(0);
  readonly currentPage = signal(1);
  readonly pageSize = 8;
  readonly totalPages = computed(() => Math.ceil(this.heroes().length / this.pageSize));
  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );
  readonly paginatedHeroes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.heroes().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.loadHeroes();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => this._heroesService.searchByName(value.trim())),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((heroes) => {
        this.heroes.set(heroes);
        this.currentPage.set(1);
      });
  }

  loadHeroes(): void {
    this.error.set(null);
    this._heroesService.getAll().subscribe({
      next: (heroes) => {
        this.heroes.set(heroes);
      },
      error: () => {
        this.error.set('No se pudieron cargar a los héroes.');
      },
    });
  }
  editHero(id: number): void {
    this._router.navigate(['/heroes', id, 'edit']);
  }
  navigateToCreateHero(): void {
    this._router.navigate(['/heroes/new']);
  }

  openDeleteModal(id: number): void {
    this.deleteModalOpen.set(true);
    this.heroIdToDelete.set(id);
  }
  deleteHero(id: number): void {
    this._heroesService.delete(id).subscribe({
      next: () => {
        this._messageService.showSuccess('Héroe eliminado satisfactoriamente.');
        this.currentPage.set(
          this.heroes().length % this.pageSize === 1 && this.currentPage() > 1
            ? this.currentPage() - 1
            : this.currentPage(),
        );
        this.loadHeroes();
      },
      error: () => {
        this._messageService.showError('Error al eliminar al héroe!');
      },
    });
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);
  }
  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }
  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }
}
