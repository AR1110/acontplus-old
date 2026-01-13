import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComprobanteEgresoStore } from '@accounting/comprobante-egreso/application/store/comprobante-egreso.store';

const _filterCiudadGroup = (opt: any[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.descripcion.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-city-search',
  imports: [FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  templateUrl: './city-search.component.html',
  styles: ``,
})
export class CitySearchComponent {
  comprobanteEgresoStore = inject(ComprobanteEgresoStore);

  stateCityGroup = '';

  ciudadGroupOptions!: any[];

  onStateGroupInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.stateCityGroup = input.value;

    this.ciudadGroupOptions = this._filterGroup(input.value || '');
  }

  private _filterGroup(value: string): any[] {
    if (value) {
      return this.comprobanteEgresoStore
        .provinciaCiudades()
        .map((group) => ({
          provincia: group.provincia,
          ciudades: _filterCiudadGroup(group.ciudades, value),
        }))
        .filter((group) => group.ciudades.length > 0);
    }

    return this.comprobanteEgresoStore.provinciaCiudades();
  }

  valueChangeCity(idCiudad: number) {
    // this.infrastructure.idCiudad = idCiudad;
    this.comprobanteEgresoStore.updateDataFormaPago({
      idCiudad,
    });
  }
}
