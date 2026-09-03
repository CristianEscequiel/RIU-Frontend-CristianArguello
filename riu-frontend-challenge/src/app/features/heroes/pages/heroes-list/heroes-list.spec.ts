import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { HeroesList } from './heroes-list';
import { HeroesService } from '../../data-access/heroes.service';
import { MessageService } from '../../../../core/services/message.service';
import { Hero } from '../../models/hero.model';
import { Modal } from '../../../../shared/components/modal/modal';

describe('HeroesList', () => {
  let component: HeroesList;
  let fixture: ComponentFixture<HeroesList>;

  const heroes: Hero[] = Array.from({ length: 17 }, (_, index) => ({
    id: index + 1,
    name: `Hero ${index + 1}`,
    superpower: `Super poder número ${index + 1}`,
    weakness: `Debilidad ${index + 1}`,
    enemy: `Enemigo ${index + 1}`,
  }));

  const heroesServiceMock = {
    getAll: vi.fn(),
    searchByName: vi.fn(),
    delete: vi.fn(),
  };

  const messageServiceMock = {
    showSuccess: vi.fn(),
    showError: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    heroesServiceMock.getAll.mockReturnValue(of(heroes));
    heroesServiceMock.searchByName.mockReturnValue(of(heroes));
    heroesServiceMock.delete.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [HeroesList],
      providers: [
        {
          provide: HeroesService,
          useValue: heroesServiceMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all heroes', () => {
    component.loadHeroes();

    expect(heroesServiceMock.getAll).toHaveBeenCalled();
    expect(component.heroes()).toEqual(heroes);
    expect(component.error()).toBeNull();
  });

  it('should set error when loading heroes fails', () => {
    heroesServiceMock.getAll.mockReturnValue(throwError(() => new Error('Load error')));

    component.loadHeroes();

    expect(component.error()).toBe('No se pudieron cargar a los héroes.');
  });

  it('should calculate pagination correctly', () => {
    component.heroes.set(heroes);

    expect(component.pageSize).toBe(8);
    expect(component.totalPages()).toBe(3);
    expect(component.pages()).toEqual([1, 2, 3]);
    expect(component.paginatedHeroes()).toHaveLength(8);
  });

  it('should return correct heroes for selected page', () => {
    component.heroes.set(heroes);

    component.goToPage(2);

    expect(component.currentPage()).toBe(2);
    expect(component.paginatedHeroes()).toEqual(heroes.slice(8, 16));

    component.goToPage(3);

    expect(component.paginatedHeroes()).toEqual(heroes.slice(16, 20));
  });

  it('should ignore invalid page numbers', () => {
    component.heroes.set(heroes);

    component.goToPage(2);

    component.goToPage(0);

    expect(component.currentPage()).toBe(2);

    component.goToPage(4);

    expect(component.currentPage()).toBe(2);
  });

  it('should navigate to next and previous page', () => {
    component.heroes.set(heroes);

    component.nextPage();

    expect(component.currentPage()).toBe(2);

    component.previousPage();

    expect(component.currentPage()).toBe(1);
  });

  it('should search by trimmed name after debounce and reset page', async () => {
    vi.useFakeTimers();

    const filteredHeroes = [heroes[0], heroes[1]];

    heroesServiceMock.searchByName.mockReturnValue(of(filteredHeroes));

    fixture.detectChanges();

    component.currentPage.set(2);

    component.searchControl.setValue('  man  ');

    await vi.advanceTimersByTimeAsync(300);

    expect(heroesServiceMock.searchByName).toHaveBeenCalledWith('man');

    expect(component.heroes()).toEqual(filteredHeroes);
    expect(component.currentPage()).toBe(1);
  });

  it('should navigate to create hero', () => {
    component.navigateToCreateHero();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes/new']);
  });

  it('should navigate to edit hero', () => {
    component.editHero(5);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes', 5, 'edit']);
  });

  it('should call editHero with the selected hero id', () => {
    component.heroes.set(heroes);

    const editSpy = vi.spyOn(component, 'editHero');

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('app-button'));

    const editButton = buttons.find(
      (button) => button.nativeElement.textContent.trim() === 'Editar',
    );

    editButton?.triggerEventHandler('clicked');

    expect(editSpy).toHaveBeenCalledWith(heroes[0].id);
  });

  it('should delete selected hero when modal confirms', () => {
    const deleteSpy = vi.spyOn(component, 'deleteHero');

    component.heroIdToDelete.set(5);

    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.directive(Modal));

    modal.triggerEventHandler('confirmed');

    expect(deleteSpy).toHaveBeenCalledWith(5);
  });

  it('should open delete confirmation modal for selected hero', () => {
    component.openDeleteModal(5);

    expect(component.deleteModalOpen()).toBe(true);
    expect(component.heroIdToDelete()).toBe(5);
  });

  it('should delete hero, show success and reload heroes', () => {
    const loadHeroesSpy = vi.spyOn(component, 'loadHeroes');

    component.deleteHero(5);

    expect(heroesServiceMock.delete).toHaveBeenCalledWith(5);

    expect(messageServiceMock.showSuccess).toHaveBeenCalledWith(
      'Héroe eliminado satisfactoriamente.',
    );

    expect(loadHeroesSpy).toHaveBeenCalled();
  });
  it('should navigate to previous page if last hero of current page is deleted', () => {
    component.heroes.set(heroes);
    component.currentPage.set(3);

    component.deleteHero(17);

    expect(component.currentPage()).toBe(2);
  });

  it('should show error when deleting hero fails', () => {
    heroesServiceMock.delete.mockReturnValue(throwError(() => new Error('Delete error')));

    component.deleteHero(5);

    expect(messageServiceMock.showError).toHaveBeenCalledWith('Error al eliminar al héroe!');
  });

  it('should delete selected hero when modal confirms', () => {
    fixture.detectChanges();

    component.openDeleteModal(3);

    const modal = fixture.debugElement.query(By.directive(Modal)).componentInstance as Modal;

    modal.confirmed.emit();

    expect(heroesServiceMock.delete).toHaveBeenCalledWith(3);
  });

  it('should render only the first page of héroes', () => {
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    expect(rows.length).toBe(8);
  });

  it('should render the alert when there is an error loading heroes', () => {
    heroesServiceMock.getAll.mockReturnValue(throwError(() => new Error('Load error')));

    component.loadHeroes();

    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('.alert');

    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('No se pudieron cargar a los héroes.');
  });

  it('should render the alert when heroes list is empty', () => {
    heroesServiceMock.getAll.mockReturnValue(of([]));

    component.loadHeroes();

    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('app-alert');

    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain(
      'El superhéroe que busca no se encuentra registrado. ¡O peor aún! No hay superhéroes en este mundo!',
    );
  });
  it('should navigate using pagination buttons', () => {
    component.heroes.set(heroes);
    component.currentPage.set(2);

    const goToPageSpy = vi.spyOn(component, 'goToPage');

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.pagination__item');

    buttons[0].click();
    expect(goToPageSpy).toHaveBeenCalledWith(1);

    buttons[2].click();
    expect(goToPageSpy).toHaveBeenCalledWith(2);

    buttons[buttons.length - 1].click();
    expect(goToPageSpy).toHaveBeenCalledWith(3);
  });
});
