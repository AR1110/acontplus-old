import {ChangeDetectionStrategy, Component, effect, inject, output, signal} from '@angular/core';
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {MatIcon} from "@angular/material/icon";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSelectModule} from "@angular/material/select";
import {MatChipsModule} from "@angular/material/chips";
import {MatCardModule} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {Button} from "@acontplus/ng-components";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DAYS_OF_WEEK} from "@restaurant/domain/models/promotion";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTimepickerModule} from "@angular/material/timepicker";
import {ItemSearch} from "@restaurant/ui/items/item-search/item-search";
import {CATEGORY_ABBREVIATIONS} from "@restaurant/domain/enums/restaurant.enum";
import {TabulatorComponent} from "@core/components/tabulator/tabulator.component";
import {ItemComposition} from "@restaurant/domain/models/item-composition";
import Swal from "sweetalert2";
import DecimalUtil from "@core/utils/decimal.util";
import {ProductMeasure} from "@inventory/domain/models/product-measure";
import {GetProductSaleUseCase} from "@inventory/product/application/use-cases/product/get-product.use-case";
import {LookupItem} from "@core/models/lookup-type";
import {LookupService} from "@restaurant/application/services/lookup-service";
import {PromotionDetail} from "@restaurant/domain/models/promotion-detail";
import {ToastrNotificationService} from "@core/services/toastr-notification.service";
import {PromotionInsertUseCase} from "@restaurant/application/use-cases/promotion-use-case";

@Component({
  selector: 'app-promotion-form',
  imports: [
    MatFormField,
    MatInputModule,
    MatIcon,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTimepickerModule,
    MatCardModule,
    MatDivider,
    Button,
    ItemSearch,
    TabulatorComponent
  ],
  templateUrl: './promotion-form.html',
  styleUrl: './promotion-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionForm {

   lookupSvc = inject(LookupService)
  private productSaleUseCase = inject(GetProductSaleUseCase);
   private notiSvc = inject(ToastrNotificationService)
  private insertUseCase = inject(PromotionInsertUseCase)

   promotionSaved = output<void>();

  // Signals
  isSubmitting = signal<boolean>(false);
  selectedProducts = signal<any[]>([]);
  selectedProductsDeleted = signal<any[]>([]);
  openSection = signal<string>('general');

  taxes = signal<LookupItem[]>([]);

  // Forms
    private fb = inject(FormBuilder)
  promotionForm!: FormGroup;
  productForm!: FormGroup;

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    const column: any = cell.getColumn().getField();
    const data: any = cell.getData();
    // const oldValue = cell.getOldValue();
    // const value = cell.getValue();

    const editor: any = document.createElement('select');

    if (column === 'measureId') {
      for (const m of data.measures || []) {
        const opt = document.createElement('option');
        opt.value = m.id.toString();
        opt.innerHTML = m.name;
        editor.appendChild(opt);
      }
    }

    if (column === 'feeId') {
      for (const t of (data.fees ?? [])) {
        const opt = document.createElement('option');
        opt.value = t.id.toString();
        opt.innerHTML = t.name + ' - $' + t.priceWithTax;
        editor.appendChild(opt);
      }
    }

    if (column === 'taxId') {
      for (const t of (this.lookupSvc.taxes() ?? [])) {
        const opt = document.createElement('option');
        opt.value = t.id.toString();
        opt.innerHTML = t.value
        editor.appendChild(opt);
      }
    }


    editor.style.padding = '3px';
    editor.style.width = '100%';
    editor.style.boxSizing = 'border-box';

    editor.value = Number(cell.getValue());

    onRendered(function () {
      editor.focus();
      editor.style.css = '100%';
    });

    function successFunc() {
      success(editor.value);
    }

    editor.addEventListener('change', successFunc);
    editor.addEventListener('blur', successFunc);

    return editor;
  };

  columns = [
    {
      title: 'Op.',
      formatter: (cell: any) => {
        const rowData = cell.getRow().getData();

        // contenedor de botones
        const buttonHolder = document.createElement('div');
        buttonHolder.style.display = 'flex';
        buttonHolder.style.gap = '4px'; // espacio entre botones
        buttonHolder.style.justifyContent = 'center';
        buttonHolder.style.alignItems = 'center';

        // Botón Eliminar
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 6h18" stroke="currentColor" stroke-width="2"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" stroke-width="2"/>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
        delBtn.classList.add('small-button', 'btn-remove', 'text-white');
        delBtn.addEventListener('click', () => {
          this.deleteRow(rowData);
        });
        buttonHolder.appendChild(delBtn);
        return buttonHolder;
      },
      width: 100,
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
    },
    {
      title: 'Código',
      field: 'productCode',
      width: 100,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: 'Menús/Producto',
      field: 'description',
      width:   350,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: 'Tipo Iva',
      field: 'taxId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter:  (cell: any)=> {
        for (const m of this.lookupSvc.taxes() ?? []) {
          if (m.id == cell.getValue()) {
            return m.value;
          }
        }
        return ''
      },
      validator: 'required',
      width: '9px',
    },
    {
      title: 'Medida',
      field: 'measureId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const m of data.measures ?? []) {
          if (m.id == cell.getValue()) {
            return m.name;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },




    //start when is product combo
    {
      title: 'Tarifa',
      field: 'feeId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const m of data.fees ?? []) {
          if (m.id == cell.getValue()) {
            return m.name;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },

    {
      title: 'Cant.',
      field: 'quantity',
      width: 80,
      editor: true,
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: 'Precio Venta',
      field: 'salePrice',
      editor: false,
      width: 120,
      widthGrow: 1,
      validator: ['numeric'],
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
    },
    // {
    //   title: 'Precio costo',
    //   field: 'unitPrice',
    //   width: 120,
    //   editor: false,
    //   hozAlign: 'center',
    //   headerSort: false,
    //   headerHozAlign: 'center',
    //   editorParams: {
    //     selectContents: true,
    //     verticalNavigation: 'table',
    //   },
    // },

    {
      title: 'Total Precio',
      field: 'totalPrice',
      width: 120,
      editor: false,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
    },
  ];


  getCategoryAbbreviationToSearch(){
    return [CATEGORY_ABBREVIATIONS.COMBO, CATEGORY_ABBREVIATIONS.RESTAURANT].toString()
  }


  async deleteRow(rowData: ItemComposition) {
    const {isConfirmed} = await Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    })

    if(isConfirmed){
      const cloneItemCompositions = JSON.parse(JSON.stringify(this.selectedProducts()));
      this.selectedProducts.set(cloneItemCompositions.filter((x: any) => x.uuid !== rowData.uuid));

      if(rowData.id>0){
        this.selectedProductsDeleted.update((x:any) => [...x, {
          ...rowData,
          isActive: false,
          isDeleted: true,
        }]);
      }
    }
  }

  constructor(
  ) {
    this.promotionForm = this.createPromotionForm();
    this.productForm = this.createProductForm();
    this.initializeScheduleControls()
    // Effect para limpiar errores al cambiar valores
    effect(() => {
      const openSectionValue = this.openSection();
      // Lógica adicional si es necesaria
    });
  }



  private createPromotionForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['percentage', Validators.required],
      value: [
        '',
        [Validators.required, Validators.min(0.01)]
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isActive: [true],
      schedule: this.fb.array([]),
      establishmentId: [0, Validators.required],
    });
  }

  private createProductForm(): FormGroup {
    return this.fb.group({
      productSelection: ['', Validators.required],
      promoPrice: ['', [Validators.required, Validators.min(0)]],
      rate: ['', Validators.min(0)],
      unit: ['', Validators.required]
    });
  }

  private initializeScheduleControls(): void {
    const scheduleArray = this.promotionForm.get('schedule') as FormArray;

    scheduleArray.clear();

    const dateNow = new Date();

    const year = dateNow.getFullYear();

    DAYS_OF_WEEK.forEach(day => {
      scheduleArray.push(
        this.fb.group({
          day: [day],
          isActive: [false],
          startTime: [new Date(year, 0, 1, 0, 0, 0)],     // 12:00 AM
          endTime: [new Date(year, 0, 1, 23, 30, 0)]      // 11:30 PM
        })
      );
    });

  }

  get scheduleArray(): FormArray {
    return this.promotionForm.get('schedule') as FormArray;
  }


  onSelectItem(rowData: any): void {
    if (!rowData?.productId) return;

    this.productSaleUseCase.execute({ id: rowData.productId }).subscribe({
      next: (response) => {
        const { product, measures } = response;
        if (!product || !Array.isArray(measures)) return;

        const compositions = structuredClone(this.selectedProducts());
        const existingIndex = compositions.findIndex(x => x.itemId === rowData.id);

        const getDefaultMeasure = (): ProductMeasure | undefined =>
          measures.find(m => m.defaultMeasure);

        const getDefaultFee = (measure?: ProductMeasure) =>
          measure?.fees?.find(f => f.isDefault);

        const getDefaultTax = (): LookupItem | undefined =>
          this.lookupSvc.taxes().find(x => x.code === product.taxCode);

        console.log(this.lookupSvc.taxes())
        if (existingIndex === -1) {
          const defaultMeasure = getDefaultMeasure();
          const defaultFee = getDefaultFee(defaultMeasure);
          const defaultTax = getDefaultTax();

          if (!defaultMeasure || !defaultFee || !defaultTax) {
            console.error('Datos incompletos para crear detalle.');
            return;
          }

          const newPromotionDetail = new PromotionDetail();
          newPromotionDetail.productCode = product.code;
          newPromotionDetail.itemId = rowData.id;
          newPromotionDetail.measures = measures;
          newPromotionDetail.measureId = defaultMeasure.id;
          newPromotionDetail.feeId = defaultFee.id;
          newPromotionDetail.taxId = defaultTax.id;
          newPromotionDetail.promotionalPrice = defaultFee.salePrice;
          newPromotionDetail.fees = defaultMeasure.fees ?? [];
          newPromotionDetail.description = product.descripcion;
          newPromotionDetail.unitPrice = defaultMeasure.costPrice;
          newPromotionDetail.taxPercentage = defaultTax.metadata?.["percentage"];

          compositions.push(new PromotionDetail(newPromotionDetail).calculate());
        } else {
          let existing = compositions[existingIndex];
          existing.quantity += 1;
          existing = new PromotionDetail(existing).calculate()

        }

        this.selectedProducts.set(compositions);
      },
      error: (err) => console.error('Error al obtener el producto:', err)
    });
  }

  async cellEdited(cell: any): Promise<void> {
    const column: string = cell.getColumn().getField();
    const oldValue = parseFloat(cell.getOldValue());
    const newValue = parseFloat(cell.getValue());

    // Copia limpia
    let data = new PromotionDetail({ ...cell.getData() });

    // Cancelaciones de edición inválida
    if (newValue === oldValue || isNaN(newValue) || cell.getValue() === '' || newValue < 0) {
      (data as any)[column] = oldValue;
      return;
    }

    // -----------------------------
    // CAMBIO DE UNIDAD (measureId)
    // -----------------------------
    if (column === "measureId") {
      const dataMeasure = data.measures.find(x => x.id === Number(newValue));

      if (dataMeasure) {
        data.unitPrice = dataMeasure.costPrice;     // costo
        data.fees = dataMeasure.fees;               // tarifas

        const defaultFee = dataMeasure.fees?.find(f => f.isDefault);
        if (!defaultFee) {
          throw new Error('No se encontró tarifa por defecto para el producto seleccionado');
        }

        // precio venta base
        data.promotionalPrice = defaultFee.salePrice;

      } else {
        // fallback
        data.unitPrice = oldValue;
      }
    }

    // -----------------------------
    // CAMBIO DE TARIFA (feeId)
    // -----------------------------
    if (column === 'feeId') {
      const dataFee = data.fees.find(x => x.id == data.feeId);
      if (dataFee) {
        data.promotionalPrice = dataFee.salePrice;
      }
    }

    // -----------------------------
    // Recalcular precio final
    // -----------------------------
    data = new PromotionDetail(data).calculate(); // ahora sí retorna this

    // -----------------------------
    // Actualizar arreglo reactivo
    // -----------------------------
    this.selectedProducts.set(
      this.selectedProducts().map(item =>
        item.uuid === data.uuid ? data : item
      )
    );
  }

  validateDates(): boolean {
    const startDate = this.promotionForm.get('startDate')?.value;
    const endDate = this.promotionForm.get('endDate')?.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      this.promotionForm.get('endDate')?.setErrors({ invalidDate: true });
      return false;
    }
    return true;
  }

  validateSchedule(): boolean {
    const scheduleData = this.scheduleArray.value;
    const hasActiveDay = scheduleData.some((day:any) => day.isActive);

    if (!hasActiveDay) {
      return false;
    }

    for (const day of scheduleData) {
      if (day.isActive && day.startTime >= day.endTime) {
        return false;
      }
    }

    return true;
  }


  // Validación y envío del formulario
   onSubmit()  {
    console.log(this.promotionForm.value)
    // Validaciones
    if (this.promotionForm.invalid) {
      this.promotionForm.markAllAsTouched();
      this.openSection.set('general');
      return;
    }
    //
    if (!this.validateDates()) {
      this.openSection.set('vigencia');
      this.notiSvc.warning({
        message: 'La fecha de finalización debe ser posterior a la de inicio'
      });
      return;
    }
    //
    // if (!this.validatePercentage()) {
    //   this.openSection.set('general');
    //   this.snackBar.open('El porcentaje no puede ser mayor a 100', 'Cerrar', {
    //     duration: 3000
    //   });
    //   return;
    // }
    //
    if (!this.validateSchedule()) {
      this.openSection.set('schedule');
      this.notiSvc.warning({
        message: 'Debe activar al menos un día con horario válido'
      })
      return;
    }

    if (this.selectedProducts().length === 0) {
      this.openSection.set('products');
      this.notiSvc.warning({
        message: 'Debe agregar al menos un producto'
      })
      return;
    }

    // Preparar datos
    this.isSubmitting.set(true);

    const formValue = this.promotionForm.value;
    const scheduleData = this.scheduleArray.value;
    //
    const promotion  = {
      name: formValue.name,
      type: formValue.type,
      value: Number(formValue.value),
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      isActive: formValue.isActive,
      selectedProducts: this.selectedProducts(),
      schedule: scheduleData,
    };

    try {
      this.insertUseCase.execute(promotion).subscribe(response => {
        if(response){
          this.notiSvc.success({
            message: 'Promoción guardada exitosamente'
          })
          this.resetForm();
          this.promotionSaved.emit();

        }else{
          this.notiSvc.warning({
            message: 'Error al guardar la promoción'
          })
        }
      })

    } catch (error: any) {
      this.notiSvc.error({
        message: 'Error al guardar la promoción'
      })
    } finally {
      this.isSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.promotionForm.reset({
      type: 'percentage',
      isActive: true
    });
    this.selectedProducts.set([]);
    this.productForm.reset();

    // Resetear schedule
    this.initializeScheduleControls()

    this.openSection.set('general');
  }

  getErrorMessage(controlName: string): string {
    const control = this.promotionForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('minLength')) return 'Mínimo 3 caracteres';
    if (control.hasError('min')) return 'El valor debe ser positivo';
    if (control.hasError('maxPercentage')) return 'El porcentaje no puede ser mayor a 100';
    if (control.hasError('invalidDate')) return 'Fecha inválida';

    return '';
  }


  toggleSection(section: string): void {
    this.openSection.set(this.openSection() === section ? '' : section);
  }
}
