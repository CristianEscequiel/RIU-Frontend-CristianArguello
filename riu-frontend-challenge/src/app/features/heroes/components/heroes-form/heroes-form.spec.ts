import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesForm } from './heroes-form';

describe('HeroesForm', () => {
  let component: HeroesForm;
  let fixture: ComponentFixture<HeroesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
