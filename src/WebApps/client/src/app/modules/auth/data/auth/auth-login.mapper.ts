import { UserData } from '../../domain/models/user-data.model';
import { isValidJSON } from '@core/utils/utils';

export class AuthLoginMapper {
  static fromJson(response: any) {
    const parsed = JSON.parse(response.payload as string);

    const dto = Array.isArray(parsed) ? parsed : [parsed];

    const mapModules = (items: any[]): any[] => {
      const nodeMap = new Map<number, any>();
      const roots: any[] = [];

      items.forEach((item) => {
        if (!nodeMap.has(item.id)) {
          const actions = isValidJSON(item.actions) ? JSON.parse(item.actions) : [];

          nodeMap.set(item.id, {
            ...item,
            actions,
            children: [],
          });
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

      // ProductPage
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
        codeRole,
        userRoleId,
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
        avatar: '/assets/images/user-avatar.jpg',
      };
      const company = {
        id: item.companyId,
        businessName: item.businessName,
        tradeName: item.tradeName,
        idCard: item.idCardCompany,
      };

      return {
        userData,
        company,
        menuItems: menusWithChildren,
        customPermissions: mappedPermissions,
        token,
        uuid,
        needAuthorization,
        userRoleId,
      };
    });
    return {
      userRoles,
      dto,
    };
  }
}
