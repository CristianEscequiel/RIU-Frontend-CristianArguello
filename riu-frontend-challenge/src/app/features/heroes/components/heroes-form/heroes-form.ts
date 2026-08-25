import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeroCreateRequest } from '../../models/hero.model';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-heroes-form',
  imports: [Button , ReactiveFormsModule],
  templateUrl: './heroes-form.html',
  styleUrl: './heroes-form.scss',
})
export class HeroesForm {
  private readonly fb = inject(FormBuilder);
  inputData = input<HeroCreateRequest>();
  sendData = output<HeroCreateRequest>();
  mode = input('')

  readonly heroesForm = this.fb.group({
    name: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),

    superpower: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),

    weakness: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    enemy: this.fb.control('', {
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


