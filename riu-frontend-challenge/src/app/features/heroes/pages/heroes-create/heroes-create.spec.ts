import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesCreate } from './heroes-create';

describe('HeroesCreate', () => {
  let component: HeroesCreate;
  let fixture: ComponentFixture<HeroesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
