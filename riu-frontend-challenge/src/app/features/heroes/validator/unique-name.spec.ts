import { FormControl } from '@angular/forms';
import { firstValueFrom, of, throwError } from 'rxjs';

import { uniqueNameValidator } from './unique-name.validator';
import { HeroesService } from '../data-access/heroes.service';

describe('uniqueNameValidator', () => {
  const heroesServiceMock = {
    existsByName: vi.fn(),
  } as unknown as HeroesService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when value is empty', async () => {
    const validator = uniqueNameValidator(heroesServiceMock);
    const control = new FormControl('   ');

    const result = await firstValueFrom(validator(control) as ReturnType<typeof of>);

    expect(result).toBeNull();
    expect(heroesServiceMock.existsByName as ReturnType<typeof vi.fn>).not.toHaveBeenCalled();
  });

  it('should return nameTaken when name already exists', async () => {
    vi.mocked(heroesServiceMock.existsByName).mockReturnValue(of(true));

    const validator = uniqueNameValidator(heroesServiceMock);
    const control = new FormControl('Superman');

    const result = await firstValueFrom(validator(control) as ReturnType<typeof of>);

    expect(heroesServiceMock.existsByName).toHaveBeenCalledWith('Superman', undefined);

    expect(result).toEqual({
      nameTaken: true,
    });
  });

  it('should return null when name is available', async () => {
    vi.mocked(heroesServiceMock.existsByName).mockReturnValue(of(false));

    const validator = uniqueNameValidator(heroesServiceMock, 5);
    const control = new FormControl(' Batman ');

    const result = await firstValueFrom(validator(control) as ReturnType<typeof of>);

    expect(heroesServiceMock.existsByName).toHaveBeenCalledWith('Batman', 5);

    expect(result).toBeNull();
  });

  it('should return null when service fails', async () => {
    vi.mocked(heroesServiceMock.existsByName).mockReturnValue(
      throwError(() => new Error('Server error')),
    );

    const validator = uniqueNameValidator(heroesServiceMock);
    const control = new FormControl('Superman');

    const result = await firstValueFrom(validator(control) as ReturnType<typeof of>);

    expect(result).toBeNull();
  });
});
