import { InjectionToken } from '@angular/core';
import { FloorRepository } from '@restaurant/data/repositories/floor.repository';

export const FLOOR_HTTP_TOKEN = new InjectionToken<FloorRepository>('FLOOR_HTTP_TOKEN');
