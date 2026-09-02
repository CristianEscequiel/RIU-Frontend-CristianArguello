import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Spinner {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly label = input('Cargando...');
}
