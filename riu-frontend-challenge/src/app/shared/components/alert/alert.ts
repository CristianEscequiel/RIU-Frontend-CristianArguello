import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Alert {
  title = input.required<string>();
  message = input.required<string>();
  variant = input.required<'success' | 'error' | 'warning' | 'info'>();
}
