import { Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { INVENTORY_PATHS } from "../enums/inventory.enum";


@Injectable({
  providedIn: 'root'
})

export class LotPriceService {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.LOT_PRICE}`;
}
