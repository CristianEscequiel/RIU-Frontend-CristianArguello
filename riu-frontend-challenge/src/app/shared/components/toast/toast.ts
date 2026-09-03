import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  open = input.required<boolean>();
  variant = input<'success' | 'error' | 'warning' | 'info'>('success');
  title = input.required<string>();
  message = input.required<string>();

  closed = output<void>();

  icon = computed(() => {
    switch (this.variant()) {
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      default:
        return '✓';
    }
  });

  close(): void {
    this.closed.emit();
  }
}
