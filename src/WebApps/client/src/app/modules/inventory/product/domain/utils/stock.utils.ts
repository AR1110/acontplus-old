export function mergeStockItems(items: any[]) {
  const grouped = items.reduce((acc: any, item: any) => {
    const key = `${item.productId}_${item.warehouseId}_${item.measureId}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  let totalQuantity = 0;
  let totalStock = 0;
  let warehouseId = 0;
  let measureId = 0;
  let productId = 0;
  Object.values(grouped).forEach((group: any) => {
    const totals = group.reduce((acc: any, item: any) => {
      const fractional = item.measures.find(
        (m: any) => m.idMedida === item.measureId && m.tipo === 'FRACCIONADO'
      );
      const principal = item.measures.find(
        (m: any) => m.idMedida === item.measureId && m.tipo === 'PRINCIPAL'
      );
      if (fractional) acc.fractional += item.quantity * fractional.conversion;
      if (principal) acc.principal += item.quantity * principal.conversion;
      acc.quantity += item.quantity;
      return acc;
    }, { fractional: 0, principal: 0, quantity: 0 });

    totalQuantity += totals.quantity;
    totalStock += totals.fractional + totals.principal;
    warehouseId = group[0].warehouseId;
    measureId = group[0].measureId;
    productId = group[0].productId;
  });

  return {
    quantity: totalQuantity,
    stockQuantity: totalStock,
    warehouseId,
    measureId,
    productId,
  };
}
