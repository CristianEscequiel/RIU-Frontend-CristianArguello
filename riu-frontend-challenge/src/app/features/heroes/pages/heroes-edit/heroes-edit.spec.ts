import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { HeroesEdit } from './heroes-edit';

describe('HeroesEdit', () => {
  let component: HeroesEdit;
  let fixture: ComponentFixture<HeroesEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesEdit],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: '1',
              }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesEdit);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
