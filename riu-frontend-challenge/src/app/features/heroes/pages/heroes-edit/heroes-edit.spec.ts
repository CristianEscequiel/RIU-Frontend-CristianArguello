import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesEdit } from './heroes-edit';

describe('HeroesEdit', () => {
  let component: HeroesEdit;
  let fixture: ComponentFixture<HeroesEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
