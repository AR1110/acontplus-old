import { signal } from "@angular/core";
import { Establecimiento } from "@core/models/estab.model";

export const establecimientos = signal<Establecimiento[]>([])
