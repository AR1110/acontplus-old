import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MatCardModule} from "@angular/material/card";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-role-selection-modal',
  imports: [
    MatCustomDialogComponent,
    MatCardModule,
    NgClass
  ],
  templateUrl: './role-selection-modal.component.html',
  styleUrl: './role-selection-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleSelectionModalComponent {
  public dialogRef = inject(MatDialogRef<RoleSelectionModalComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);
  defaultIcon = 'assets/icons/default-user.png';
  roles = signal<any>([])
  selectedRole: any | null = null;

  /**
   * Generates an acronym from a business or trade name string.
   * E.g., "El Buen Sabor" -> "EBS"
   * E.g., "Soluciones Tecnológicas S.A." -> "STSA"
   * @param {string} name - The name to process.
   * @returns {string} The uppercase acronym.
   */
  private generateAcronym(name: string) {
    if (!name) return '';

    // 1. Remove common separators (like commas, dashes) and replace multiple spaces with a single one.
    // 2. Split the string by space.
    // 3. Filter out common short connecting words (prepositions, articles) in Spanish (optional but improves quality).
    // 4. Map the remaining words to their first letter.
    // 5. Join the letters and convert to uppercase.

    const words = name
      .replace(/[,;()&.-]/g, '') // Remove punctuation
      .split(/\s+/); // Split by one or more spaces

    const stopWords = new Set(['de', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'e', 'o', 'sas', 's.a.', 'cia', 'ltda']); // Common words to ignore

    const acronym = words
      .filter(word => word.length > 0 && !stopWords.has(word.toLowerCase()))
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();

    // Limit to a reasonable length (e.g., 5 characters) for the logo circle
    return acronym.substring(0, 5);
  }


  ngOnInit(): void {
    console.log(this.params)
    this.roles.set( [
        {
          "userData": {
            "id": 10,
            "username": "zaratec",
            "fullName": "ZARATE IÑIGUEZ CHRISTIAN IVAN",
            "roleName": "ADMINISTRADOR",
            "companyId": 195,
            "codeRole": "ADM",
            "idCard": "0102762531",

          },
          "company": {
            "id": 195,
            "businessName": "ACONTPLUS S.A.S.",
            "tradeName": "ACONTPLUS S.A.S.",
            "idCard": "2293530915001"
          },
          "menus": [
            {
              "id": 9,
              "code": "GV",
              "url": "javascript:void(0)",
              "icon": "mdi mdi-chart-line",
              "name": "Gestión Ventas",
              "actions": "[]",
              "children": [
                {
                  "id": 73,
                  "code": "APRBC",
                  "url": "/AprobacionDocumento/Index",
                  "icon": "fas fa-exchange-alt fa-xs",
                  "name": "Aprob. Comprobante",
                  "parentId": 9,
                  "actions": "[{\"id\":1,\"code\":\"LEER\",\"name\":\"leer\",\"description\":\"Leer\"},{\"id\":2,\"code\":\"CREAR\",\"name\":\"crear\",\"description\":null},{\"id\":3,\"code\":\"EDITA\",\"name\":\"editar\",\"description\":null},{\"id\":4,\"code\":\"ELIMI\",\"name\":\"eliminar\",\"description\":null},{\"id\":5,\"code\":\"REPOR\",\"name\":\"reporte\",\"description\":null},{\"id\":6,\"code\":\"EC\",\"name\":\"enviarCorreo\",\"description\":null},{\"id\":7,\"code\":\"CP\",\"name\":\"cobroPago\",\"description\":null},{\"id\":8,\"code\":\"ES\",\"name\":\"enviarSri\",\"description\":null},{\"id\":9,\"code\":\"HF\",\"name\":\"historialFinanciero\",\"description\":null},{\"id\":10,\"code\":\"CUOTA\",\"name\":\"cuota\",\"description\":null},{\"id\":11,\"code\":\"ANULA\",\"name\":\"anular\",\"description\":null},{\"id\":12,\"code\":\"IMPUE\",\"name\":\"impuesto\",\"description\":null},{\"id\":13,\"code\":\"KARDE\",\"name\":\"kardex\",\"description\":null},{\"id\":14,\"code\":\"IMAGE\",\"name\":\"imagen\",\"description\":null},{\"id\":15,\"code\":\"ACCES\",\"name\":\"acceso\",\"description\":null},{\"id\":16,\"code\":\"AC\",\"name\":\"aperturarCaja\",\"description\":null},{\"id\":17,\"code\":\"CC\",\"name\":\"cerrarCaja\",\"description\":\"Cerrar Caja\"},{\"id\":18,\"code\":\"GD\",\"name\":\"generarDocumento\",\"description\":null},{\"id\":19,\"code\":\"MOVIM\",\"name\":\"movimiento\",\"description\":null}]",
                  "children": []
                }
              ]
            },
            {
              "id": 12,
              "code": "T",
              "url": "javascript:void(0)",
              "icon": "mdi mdi-book-open",
              "name": "Gestión Financiera",
              "actions": "[]",
              "children": [
                {
                  "id": 71,
                  "code": "RP",
                  "url": "Contabilidad/PaymentsReport/Index",
                  "icon": "",
                  "name": "Reporte Pagos",
                  "parentId": 12,
                  "actions": "[{\"id\":1,\"code\":\"LEER\",\"name\":\"leer\",\"description\":\"Leer\"},{\"id\":2,\"code\":\"CREAR\",\"name\":\"crear\",\"description\":null},{\"id\":16,\"code\":\"AC\",\"name\":\"aperturarCaja\",\"description\":null},{\"id\":17,\"code\":\"CC\",\"name\":\"cerrarCaja\",\"description\":\"Cerrar Caja\"},{\"id\":19,\"code\":\"MOVIM\",\"name\":\"movimiento\",\"description\":null},{\"id\":3,\"code\":\"EDITA\",\"name\":\"editar\",\"description\":null}]",
                  "children": []
                },
                {
                  "id": 72,
                  "code": "SUB",
                  "url": "/Contabilidad/SubEntidadFinanciera/Index",
                  "icon": "fa-menu",
                  "name": "Sub Entidad Financiera",
                  "parentId": 12,
                  "actions": "[{\"id\":1,\"code\":\"LEER\",\"name\":\"leer\",\"description\":\"Leer\"},{\"id\":2,\"code\":\"CREAR\",\"name\":\"crear\",\"description\":null},{\"id\":3,\"code\":\"EDITA\",\"name\":\"editar\",\"description\":null},{\"id\":4,\"code\":\"ELIMI\",\"name\":\"eliminar\",\"description\":null},{\"id\":5,\"code\":\"REPOR\",\"name\":\"reporte\",\"description\":null},{\"id\":6,\"code\":\"EC\",\"name\":\"enviarCorreo\",\"description\":null},{\"id\":7,\"code\":\"CP\",\"name\":\"cobroPago\",\"description\":null},{\"id\":8,\"code\":\"ES\",\"name\":\"enviarSri\",\"description\":null},{\"id\":9,\"code\":\"HF\",\"name\":\"historialFinanciero\",\"description\":null},{\"id\":10,\"code\":\"CUOTA\",\"name\":\"cuota\",\"description\":null},{\"id\":11,\"code\":\"ANULA\",\"name\":\"anular\",\"description\":null},{\"id\":12,\"code\":\"IMPUE\",\"name\":\"impuesto\",\"description\":null},{\"id\":13,\"code\":\"KARDE\",\"name\":\"kardex\",\"description\":null},{\"id\":14,\"code\":\"IMAGE\",\"name\":\"imagen\",\"description\":null},{\"id\":15,\"code\":\"ACCES\",\"name\":\"acceso\",\"description\":null},{\"id\":16,\"code\":\"AC\",\"name\":\"aperturarCaja\",\"description\":null},{\"id\":17,\"code\":\"CC\",\"name\":\"cerrarCaja\",\"description\":\"Cerrar Caja\"},{\"id\":18,\"code\":\"GD\",\"name\":\"generarDocumento\",\"description\":null},{\"id\":19,\"code\":\"MOVIM\",\"name\":\"movimiento\",\"description\":null}]",
                  "children": []
                }
              ]
            }
          ],
          "permissions": {
            "sales": {
              "fields": {
                "issueDate": true,
                "creditTime": true,
                "rate": true,
                "discountPercent": true,
                "discountAmount": true
              },
              "details": {
                "measure": true,
                "vatType": true,
                "rate": true,
                "unitPrice": true,
                "priceWithVat": true,
                "discountPercent": true,
                "discountAmount": true
              },
              "additional": {
                "keyRequest": false,
                "usersAdmin": [],
                "viewOthersDocs": false,
                "kardex": true,
                "salesTotals": true
              }
            },
            "cashAccounting": {
              "viewOtherCash": true,
              "movementReport": true,
              "closeCash": true,
              "enterKey": true,
              "pendingTransactionReport": true,
              "detailControlReport": true
            },
            "product": {
              "priceManagement": true,
              "locationManagement": true
            }
          },
          "token": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InphcmF0ZWNAYWNvbnRwbHVzLmNvbS5lYyIsImdpdmVuX25hbWUiOiJaQVJBVEUgScORSUdVRVogQ0hSSVNUSUFOIElWQU4iLCJqdGkiOiI2NzRiMzUwZC01OTFmLTQ1OTgtOWNkMC04MGM4Zjc3ODM2ZDAiLCJuYW1lIjoiWkFSQVRFIEnDkUlHVUVaIENIUklTVElBTiBJVkFOIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIxMCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiIxMCIsInVuaXF1ZV9uYW1lIjoiemFyYXRlYyIsInVzZXJSb2xlSWQiOiIzMDciLCJpZENhcmRDb21wYW55IjoiMjI5MzUzMDkxNTAwMSIsImNvbXBhbnlJZCI6IjE5NSIsInRyYWRlTmFtZSI6IkFDT05UUExVUyBTLkEuUy4iLCJidXNpbmVzc05hbWUiOiJBQ09OVFBMVVMgUy5BLlMuIiwidXJsR2F0ZXdheSI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNjAiLCJleHAiOjE3OTA2NzcyNDB9.n9YmkLeAddsgfTBB65JPRiKtTxW_F1a3rtWCt8bvrss",
          "uuid": "07F5E7B3-5492-43E6-B0D4-DDC84A9C3B92",
          "needAuthorization": false,
          imageUrl: `https://placehold.co/100x100/f59e0b/ffffff?text=${this.generateAcronym("ACONTPLUS S.A.S.")}`
        },
      {
        "userData": {
          "id": 10,
          "username": "zaratec",
          "fullName": "ZARATE IÑIGUEZ CHRISTIAN IVAN",
          "roleName": "ADMINISTRADOR",
          "companyId": 195,
          "codeRole": "ADM",
          "idCard": "0102762531",

        },
        "company": {
          "id": 195,
          "businessName": "ACONTPLUS S.A.S.",
          "tradeName": "ACONTPLUS S.A.S.",
          "idCard": "2293530915001"
        },
        "menus": [
          {
            "id": 9,
            "code": "GV",
            "url": "javascript:void(0)",
            "icon": "mdi mdi-chart-line",
            "name": "Gestión Ventas",
            "actions": "[]",
            "children": [
              {
                "id": 73,
                "code": "APRBC",
                "url": "/AprobacionDocumento/Index",
                "icon": "fas fa-exchange-alt fa-xs",
                "name": "Aprob. Comprobante",
                "parentId": 9,
                "actions": "[{\"id\":1,\"code\":\"LEER\",\"name\":\"leer\",\"description\":\"Leer\"},{\"id\":2,\"code\":\"CREAR\",\"name\":\"crear\",\"description\":null},{\"id\":3,\"code\":\"EDITA\",\"name\":\"editar\",\"description\":null},{\"id\":4,\"code\":\"ELIMI\",\"name\":\"eliminar\",\"description\":null},{\"id\":5,\"code\":\"REPOR\",\"name\":\"reporte\",\"description\":null},{\"id\":6,\"code\":\"EC\",\"name\":\"enviarCorreo\",\"description\":null},{\"id\":7,\"code\":\"CP\",\"name\":\"cobroPago\",\"description\":null},{\"id\":8,\"code\":\"ES\",\"name\":\"enviarSri\",\"description\":null},{\"id\":9,\"code\":\"HF\",\"name\":\"historialFinanciero\",\"description\":null},{\"id\":10,\"code\":\"CUOTA\",\"name\":\"cuota\",\"description\":null},{\"id\":11,\"code\":\"ANULA\",\"name\":\"anular\",\"description\":null},{\"id\":12,\"code\":\"IMPUE\",\"name\":\"impuesto\",\"description\":null},{\"id\":13,\"code\":\"KARDE\",\"name\":\"kardex\",\"description\":null},{\"id\":14,\"code\":\"IMAGE\",\"name\":\"imagen\",\"description\":null},{\"id\":15,\"code\":\"ACCES\",\"name\":\"acceso\",\"description\":null},{\"id\":16,\"code\":\"AC\",\"name\":\"aperturarCaja\",\"description\":null},{\"id\":17,\"code\":\"CC\",\"name\":\"cerrarCaja\",\"description\":\"Cerrar Caja\"},{\"id\":18,\"code\":\"GD\",\"name\":\"generarDocumento\",\"description\":null},{\"id\":19,\"code\":\"MOVIM\",\"name\":\"movimiento\",\"description\":null}]",
                "children": []
              }
            ]
          },
          {
            "id": 12,
            "code": "T",
            "url": "javascript:void(0)",
            "icon": "mdi mdi-book-open",
            "name": "Gestión Financiera",
            "actions": "[]",
            "children": [
              {
                "id": 71,
                "code": "RP",
                "url": "Contabilidad/PaymentsReport/Index",
                "icon": "",
                "name": "Reporte Pagos",
                "parentId": 12,
                "actions": "[{\"id\":1,\"code\":\"LEER\",\"name\":\"leer\",\"description\":\"Leer\"},{\"id\":2,\"code\":\"CREAR\",\"name\":\"crear\",\"description\":null},{\"id\":16,\"code\":\"AC\",\"name\":\"aperturarCaja\",\"description\":null},{\"id\":17,\"code\":\"CC\",\"name\":\"cerrarCaja\",\"description\":\"Cerrar Caja\"},{\"id\":19,\"code\":\"MOVIM\",\"name\":\"movimiento\",\"description\":null},{\"id\":3,\"code\":\"EDITA\",\"name\":\"editar\",\"description\":null}]",
                "children": []
              },
              {
                "id": 72,
                "code": "SUB",
                "url": "/Contabilidad/SubEntidadFinanciera/Index",
                "icon": "fa-menu",
                "name": "Sub Entidad Financiera",
                "parentId": 12,
                "actions": "[{\"id\":1,\"code\":\"LEER\",\"name\":\"leer\",\"description\":\"Leer\"},{\"id\":2,\"code\":\"CREAR\",\"name\":\"crear\",\"description\":null},{\"id\":3,\"code\":\"EDITA\",\"name\":\"editar\",\"description\":null},{\"id\":4,\"code\":\"ELIMI\",\"name\":\"eliminar\",\"description\":null},{\"id\":5,\"code\":\"REPOR\",\"name\":\"reporte\",\"description\":null},{\"id\":6,\"code\":\"EC\",\"name\":\"enviarCorreo\",\"description\":null},{\"id\":7,\"code\":\"CP\",\"name\":\"cobroPago\",\"description\":null},{\"id\":8,\"code\":\"ES\",\"name\":\"enviarSri\",\"description\":null},{\"id\":9,\"code\":\"HF\",\"name\":\"historialFinanciero\",\"description\":null},{\"id\":10,\"code\":\"CUOTA\",\"name\":\"cuota\",\"description\":null},{\"id\":11,\"code\":\"ANULA\",\"name\":\"anular\",\"description\":null},{\"id\":12,\"code\":\"IMPUE\",\"name\":\"impuesto\",\"description\":null},{\"id\":13,\"code\":\"KARDE\",\"name\":\"kardex\",\"description\":null},{\"id\":14,\"code\":\"IMAGE\",\"name\":\"imagen\",\"description\":null},{\"id\":15,\"code\":\"ACCES\",\"name\":\"acceso\",\"description\":null},{\"id\":16,\"code\":\"AC\",\"name\":\"aperturarCaja\",\"description\":null},{\"id\":17,\"code\":\"CC\",\"name\":\"cerrarCaja\",\"description\":\"Cerrar Caja\"},{\"id\":18,\"code\":\"GD\",\"name\":\"generarDocumento\",\"description\":null},{\"id\":19,\"code\":\"MOVIM\",\"name\":\"movimiento\",\"description\":null}]",
                "children": []
              }
            ]
          }
        ],
        "permissions": {
          "sales": {
            "fields": {
              "issueDate": true,
              "creditTime": true,
              "rate": true,
              "discountPercent": true,
              "discountAmount": true
            },
            "details": {
              "measure": true,
              "vatType": true,
              "rate": true,
              "unitPrice": true,
              "priceWithVat": true,
              "discountPercent": true,
              "discountAmount": true
            },
            "additional": {
              "keyRequest": false,
              "usersAdmin": [],
              "viewOthersDocs": false,
              "kardex": true,
              "salesTotals": true
            }
          },
          "cashAccounting": {
            "viewOtherCash": true,
            "movementReport": true,
            "closeCash": true,
            "enterKey": true,
            "pendingTransactionReport": true,
            "detailControlReport": true
          },
          "product": {
            "priceManagement": true,
            "locationManagement": true
          }
        },
        "token": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InphcmF0ZWNAYWNvbnRwbHVzLmNvbS5lYyIsImdpdmVuX25hbWUiOiJaQVJBVEUgScORSUdVRVogQ0hSSVNUSUFOIElWQU4iLCJqdGkiOiI2NzRiMzUwZC01OTFmLTQ1OTgtOWNkMC04MGM4Zjc3ODM2ZDAiLCJuYW1lIjoiWkFSQVRFIEnDkUlHVUVaIENIUklTVElBTiBJVkFOIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIxMCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiIxMCIsInVuaXF1ZV9uYW1lIjoiemFyYXRlYyIsInVzZXJSb2xlSWQiOiIzMDciLCJpZENhcmRDb21wYW55IjoiMjI5MzUzMDkxNTAwMSIsImNvbXBhbnlJZCI6IjE5NSIsInRyYWRlTmFtZSI6IkFDT05UUExVUyBTLkEuUy4iLCJidXNpbmVzc05hbWUiOiJBQ09OVFBMVVMgUy5BLlMuIiwidXJsR2F0ZXdheSI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNjAiLCJleHAiOjE3OTA2NzcyNDB9.n9YmkLeAddsgfTBB65JPRiKtTxW_F1a3rtWCt8bvrss",
        "uuid": "07F5E7B3-5492-43E6-B0D4-DDC84A9C3B92",
        "needAuthorization": false,
        imageUrl: `https://placehold.co/100x100/f59e0b/ffffff?text=${this.generateAcronym("ACONTPLUS S.A.S.")}`
      }
      ] )
    console.log(this.roles())
  }

  selectRole(role: any, shouldSave: boolean): void {
    this.selectedRole = role;

  }
}
