import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { SKIP_GLOBAL_LOADING } from '../http-context/http-context.tokens';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const skipLoading = request.context.get(SKIP_GLOBAL_LOADING);
  const loadingService = inject(LoadingService);

  if (skipLoading) {
    return next(request);
  }

  loadingService.show();

  return next(request).pipe(
    finalize(() => {
      loadingService.hide();
    }),
  );
};
