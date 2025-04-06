
import { Observable } from 'rxjs';
import {MenuItem, SubMenuItem} from "@domain/models/menu.model";

export abstract class  MenuRepository {
  abstract getMenus(): Observable<MenuItem[]>;
  abstract getSubmenusByParentId(parentId: string): Observable<SubMenuItem[]>;
}
