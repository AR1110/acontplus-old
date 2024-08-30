import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.INGREDIENT}`;
  #http = inject(HttpClient);
}
