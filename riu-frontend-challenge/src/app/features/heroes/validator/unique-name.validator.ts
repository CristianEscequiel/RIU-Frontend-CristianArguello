import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { HeroesService } from '../data-access/heroes.service';

export function uniqueNameValidator(service: HeroesService, excludeId?: number): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value?.trim();

    if (!value) {
      return of(null);
    }

    return service.existsByName(value, excludeId).pipe(
      map((exists) => (exists ? { nameTaken: true } : null)),
      catchError(() => of(null)),
    );
  };
}
