import {Injectable} from "@angular/core";
import {MenuRepository} from "@domain/repositories/menu.repository";
import {BaseUseCase} from "@core/base-use-case";
import {MenuItem} from "@domain/models/menu.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GetMenusUseCase implements BaseUseCase<MenuItem[], any> {
  constructor(private _repo: MenuRepository) {
  }

  execute( ): Observable<MenuItem[]> {
       return this._repo.getMenus()
    }


}
