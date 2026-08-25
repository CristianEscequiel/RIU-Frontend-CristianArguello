import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './core/services/message.service';
import { LoadingService } from './core/services/loading.service';
import { Spinner } from './shared/components/spinner/spinner';
import { Toast } from './shared/components/toast/toast';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , Spinner , Toast , Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-enterprise-lab');
  private readonly messageService = inject(MessageService);
  readonly loadingService = inject(LoadingService);
  message = this.messageService.message;
  closeToast() {
    this.messageService.clear();
  }
}
