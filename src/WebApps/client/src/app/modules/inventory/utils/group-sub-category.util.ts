

export const groupSubCategoryUtil = (subCategorias: any) => {
  let results = subCategorias.reduce(function (acc: any, obj: any) {
    let key = obj.familia;
    let existingGroup = acc.find(function (group: any) {
      return group.familia === key;
    });

    if (existingGroup) {
      existingGroup.subFamilias.push({
        idSubFamilia: obj.idSubFamilia,
        subFamilia: obj.subFamilia
      });
    } else {
      acc.push({
        familia: key,
        subFamilias: [{
          idSubFamilia: obj.idSubFamilia,
          subFamilia: obj.subFamilia
        }]
      });
    }

    return acc;
  }, []);

  return results;
}
