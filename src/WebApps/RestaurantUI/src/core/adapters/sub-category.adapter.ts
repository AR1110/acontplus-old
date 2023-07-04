import { ApiSubCategory } from "../models";
// API wants a nested, complicated object
// export const toApi = (uiObj) => ({
//     steps: uiObj.messages.map(message => ({
//       send_timing: toApiSendTiming(message),
//       substep: {
//         template_id: message.templateId,
//         subject: message.subject,
//         sender_id: message.senderId,
//       },
//     }),
//     name: uiObj.name,
//   });

// Make a nice flat object from the nested API response
export const SubCategoryAdapterFromApi = (category: ApiSubCategory) => ({
  idSubFamilia: category.idSubFamilia,
  idFamilia: category.idFamilia,
  totalRecords: category.totalRecords,
  estado: category.estado,
  description: category.descripcion,
  siglas: category.siglas,
  codigo: category.codigo,
  montoObjetivo: category.montoObjetivo,
  nombreFamilia: category.nombreFamilia,
});
