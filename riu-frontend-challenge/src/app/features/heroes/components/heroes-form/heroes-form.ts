import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeroCreateRequest } from '../../models/hero.model';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-heroes-form',
  imports: [Button , ReactiveFormsModule],
  templateUrl: './heroes-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesForm {
  private readonly _fb = inject(FormBuilder);
  readonly inputData = input<HeroCreateRequest>();
  readonly sendData = output<HeroCreateRequest>();
  readonly variant = input('create' as 'create' | 'edit');

  readonly heroesForm = this._fb.group({
    name: this._fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
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
    if (data) {
      this.heroesForm.patchValue(data);
    }
  }

  isInvalid(controlName: keyof typeof this.heroesForm.controls): boolean {
    const control = this.heroesForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.sendData.emit(this.heroesForm.getRawValue());
  }

}


