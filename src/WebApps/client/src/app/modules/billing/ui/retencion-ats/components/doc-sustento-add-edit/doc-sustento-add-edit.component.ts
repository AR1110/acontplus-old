// import { Component, Input } from '@angular/core';
// import { FaIconComponent } from '@fortawesome/angular-fontawesome';
// import {
//   FormArray,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import {
//   MatExpansionPanel,
//   MatExpansionPanelDescription,
//   MatExpansionPanelHeader,
//   MatExpansionPanelTitle,
// } from '@angular/material/expansion';
// import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
// import { SustentoTributario } from '@sri/domain/models/sustento-tributario';
//
// @Component({
//   selector: 'app-doc-sustento-add-edit',
//   imports: [
//     FaIconComponent,
//     FormsModule,
//     MatExpansionPanel,
//     MatExpansionPanelDescription,
//     MatExpansionPanelHeader,
//     MatExpansionPanelTitle,
//     ReactiveFormsModule,
//     ThemeButtonComponent,
//   ],
//   templateUrl: './doc-sustento-add-edit.component.html',
//   styles: ``,
// })
// export class DocSustentoAddEditComponent {
//   @Input() docSustentoGroup!: FormGroup;
//   @Input() retencionAtsForm!: FormGroup;
//   panelOpenState = -1;
//   sustentosFiltered: SustentoTributario[] = [];
//
//
//   setPanelOpen(index: number) {
//     this.panelOpenState = index;
//   }
//
//   getDocIndex(): number {
//     const docGroupsArray = this.retencionAtsForm.get('docgroup') as FormArray;
//     return docGroupsArray.controls.indexOf(this.docSustentoGroup);
//   }
//
//
//
//   selectSustento(index: number) {
//     // Filter sustentos based on document type
//     this.sustentosFiltered = [];
//     const codDocSustento =
//       this.docSustentoArray.controls[index].get('codDocSustento')?.value;
//
//     this.sustentosFiltered = this.sustentosTributarios.filter(
//       (x) => x.codDocSustento === codDocSustento,
//     );
//   }
// }
