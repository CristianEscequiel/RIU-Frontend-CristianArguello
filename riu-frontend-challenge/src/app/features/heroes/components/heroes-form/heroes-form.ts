import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeroCreateRequest } from '../../models/hero.model';
import { Button } from '../../../../shared/components/button/button';
import { HeroesService } from '../../data-access/heroes.service';
import { uniqueNameValidator } from '../../validator/unique-name.validator';
import { Spinner } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-heroes-form',
  imports: [Button, ReactiveFormsModule, Spinner],
  templateUrl: './heroes-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesForm {
  private readonly _fb = inject(FormBuilder);
  private readonly _heroesService = inject(HeroesService);
  readonly inputData = input<HeroCreateRequest>();
  readonly sendData = output<HeroCreateRequest>();
  readonly variant = input('create' as 'create' | 'edit');
  readonly heroId = input<number | null>(null);

  readonly heroesForm = this._fb.group({
    name: this._fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
      asyncValidators: [uniqueNameValidator(inject(HeroesService))]
    }),

    superpower: this._fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),

    weakness: this._fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    enemy: this._fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    const data = this.inputData();
    const id = this.heroId();
    if (data) {
      this.heroesForm.patchValue(data);
    }
    this.configureNameValidator(id ?? undefined);
  }

  isInvalid(controlName: keyof typeof this.heroesForm.controls): boolean {
    const control = this.heroesForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.sendData.emit(this.heroesForm.getRawValue());
  }

  configureNameValidator(heroId?: number): void {
    const nameControl = this.heroesForm.controls.name;

    nameControl.setAsyncValidators([
      uniqueNameValidator(this._heroesService, heroId)
    ]);

    nameControl.updateValueAndValidity();
  }

}


