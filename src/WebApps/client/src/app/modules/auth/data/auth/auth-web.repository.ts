import { PATHS_AUTH } from '@modules/auth/domain/constants/auth.constants';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponse } from '@core/models/api-response';
import { User } from '../../domain/models/user.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthWebRepository implements AuthRepository {
  private _url = `${PATHS_API.IDENTITY}${PATHS_AUTH.ACCOUNT}`;
  private http = inject(HttpClient);

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this._url}login`, credentials).pipe(
      map((response) => {
        const result = {
          success: false,
          message: '',
          userRoles: [],
          userRolesOriginal: [],
        };

        if (response.code === '0') {
          result.message = response.message;
          return result;
        }

        const dto = JSON.parse(response.payload as string);

        // --- Map modules to tree ---
        const mapModules = (items: any[]): any[] => {
          const nodeMap = new Map<number, any>();
          const roots: any[] = [];

          items.forEach((item) => {
            if (!nodeMap.has(item.id)) {
              nodeMap.set(item.id, { ...item, children: [] });
            }
          });

          nodeMap.forEach((node) => {
            if (node.parentId !== undefined && nodeMap.has(node.parentId)) {
              nodeMap.get(node.parentId).children.push(node);
            } else if (node.parentId === undefined) {
              roots.push(node);
            }
          });

          return roots;
        };

        // --- Map permissions with English keys ---
        const mapPermissions = (perms: any[]): any => {
          const p = perms[0];

          // Sales
          const salesData = p.sales[0];
          const comprobante = JSON.parse(salesData.comprobante || '{}');
          const detalle = JSON.parse(salesData.detalle || '{}');
          const adicionales = JSON.parse(salesData.adicionales || '{}');

          const sales = {
            fields: {
              issueDate: comprobante.fechaEmision,
              creditTime: comprobante.tiempoCredito,
              rate: comprobante.tarifa,
              discountPercent: comprobante.porcentajeDescuento,
              discountAmount: comprobante.descuento,
            },
            details: {
              measure: detalle.medida,
              vatType: detalle.tipoIva,
              rate: detalle.tarifa,
              unitPrice: detalle.precioUnitario,
              priceWithVat: detalle.precioConIva,
              discountPercent: detalle.porcentajeDescuento,
              discountAmount: detalle.descuento,
            },
            additional: {
              keyRequest: adicionales.keyRequest,
              usersAdmin: adicionales.usersAdmin,
              viewOthersDocs: adicionales.viewOthersDocs,
              kardex: adicionales.kardex,
              salesTotals: adicionales.totalesVenta,
            },
          };

          // Cash Accounting
          const cashData = p.cashAccounting[0];
          const cashAccounting = {
            viewOtherCash: cashData.verOtrasCajas,
            movementReport: cashData.reporteMovimiento,
            closeCash: cashData.cerrarCaja,
            enterKey: cashData.enterKey,
            pendingTransactionReport: cashData.reporteTransaccionPendiente,
            detailControlReport: cashData.reporteDetalleControlCaja,
          };

          // Product
          const productData = p.product[0];
          const product = {
            priceManagement: productData.precio,
            locationManagement: productData.gestionUbicacion,
          };

          return { sales, cashAccounting, product };
        };

        // --- Map user roles ---
        const userRoles = dto.map((item: any) => {
          const {
            menus,
            userId,
            username,
            fullname,
            role,
            companyId,
            token,
            permissions,
            uuid,
            needAuthorization,
            codeRole
          } = item;

          const fullTree = mapModules(menus);
          const mappedPermissions = mapPermissions(permissions);

          // Only root menus
          const menusWithChildren = fullTree.filter((node) => node.children.length > 0);

          const userData = {
            id: userId,
            username,
            fullName: fullname,
            roleName: role,
            companyId,
            codeRole,
            idCard: item.idCardUser,
            company: {
              id: item.companyId,
              businessName: item.businessName,
              tradeName: item.tradeName,
              idCard: item.idCardCompany
            },
          };

          return {
            userData,
            menus: menusWithChildren,
            permissions: mappedPermissions,
            token,
            uuid,
            needAuthorization,
          };
        });

        result.success = true;
        result.userRoles = userRoles;
        result.userRolesOriginal = dto;

        return result;
      }),
    );
  }

  register(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this._url}register`, user);
  }
}
