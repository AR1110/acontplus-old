export const groupSubCategoryUtil = (subCategorias: any) => {
  const results = subCategorias.reduce(function (acc: any, obj: any) {
    const key = obj.familia;
    const existingGroup = acc.find(function (group: any) {
      return group.familia === key;
    });

    if (existingGroup) {
      existingGroup.subFamilias.push({
        idSubFamilia: obj.idSubFamilia,
        subFamilia: obj.subFamilia || obj.descripcion,
      });
    } else {
      acc.push({
        familia: key,
        subFamilias: [
          {
            idSubFamilia: obj.idSubFamilia,
            subFamilia: obj.subFamilia || obj.descripcion,
          },
        ],
      });
    }

    return acc;
  }, []);

  return results;
};
