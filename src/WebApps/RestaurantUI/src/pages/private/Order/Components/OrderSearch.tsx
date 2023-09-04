import * as React from "react";
import { CustomerReadDto } from "@/core/models";
import { CustomerService } from "@/core/services";
import { Autocomplete, TextField } from "@mui/material";

type SearchReturnProps = {
  setCustomerValue(customerId?: number): void;
};

export default function OrderSearch({ setCustomerValue }: SearchReturnProps) {
  const [customer, setCustomers] = React.useState<CustomerReadDto[]>([]);

  const onSearch = (_: any, value: string) => {
    customerSearch(value);
  };

  const customerSearch = (textSearch: string) => {
    if (textSearch.length < 2) return;
    setCustomers([]);
    CustomerService.search(textSearch)
      .then((response) => {
        setCustomers(response);
      })
      .finally(() => {
        console.log("finally");
      });
  };

  // const validateIDNumber = (numeroIdentificacion: string) => {
  //   numeroIdentificacion = numeroIdentificacion.trim();

  //   if (![10, 13].includes(numeroIdentificacion.length)) return;

  //   if (!isNumber(numeroIdentificacion)) return;

  //   if (
  //     numeroIdentificacion.length === 13 &&
  //     numeroIdentificacion.slice(-3) !== "001"
  //   )
  //     return;

  //   return true;
  // };

  // function isNumber(valor: string): boolean {
  //   // Utilizamos una expresión regular para verificar si el valor es una secuencia de dígitos.
  //   // ^ indica el inicio de la cadena, $ indica el final de la cadena.
  //   // \d representa un dígito, y + indica que debe haber uno o más dígitos.
  //   const regex = /^\d+$/;
  //   return regex.test(valor);
  // }

  // const customerSearchSRI = async (numeroIdentificacion: string) => {
  //   if (validateIDNumber(numeroIdentificacion)) {
  //     const isCustomerRegistered = await CustomerService.isCustomerRegistered({
  //       textSearch: numeroIdentificacion,
  //     });

  //     if (!isCustomerRegistered) {
  //       executeSearchCustomerSRI(numeroIdentificacion);
  //     }
  //   }
  // };

  // const executeSearchCustomerSRI = (numeroIdentificacion: string) => {
  //   //Si es RUC
  //   if (
  //     numeroIdentificacion.length === 13) {
  //     //Buscar SRI
  //     showLoader(true);
  //     SharedService.checkClientSRIByRUC(numeroIdentificacion)
  //       .then((response) => {
  //         const { numeroRuc, razonSocial, direccion, telefono, email, error } =  response;
  //         if (!numeroRuc) {
  //           SnackbarUtility.warning(error!);
  //           return;
  //         }

  //         formik.setValues({
  //           ...formik.values,
  //           numeroIdentificacion,
  //           idCliente: 0,
  //           nombreComercial: razonSocial,
  //           nombreFiscal: razonSocial,
  //           direccion,
  //           emails: email,
  //           telefonos: telefono,
  //         });
  //       })
  //       .finally(() => showLoader(false));
  //   }

  //   //Si es Cedula
  //   if (
  //     numeroIdentificacion.length === 10 &&
  //     tiposIdentificacion.find(
  //       (obj) => obj.idTipoIdentificacion === formik.values.idTipoIdentificacion
  //     )?.codigoSri === SRI_IDENTIFITION_CODE.LICENSE
  //   ) {
  //     //Buscar SRI
  //     showLoader(true);
  //     SharedService.checkClientSRIByCedula(numeroIdentificacion)
  //       .then((response) => {
  //         console.log(response);
  //         const { direccion, email, error, nombreCompleto, telefono } =
  //           response;
  //         if (response.nombreCompleto) {
  //           SnackbarUtility.warning(error!);
  //           return;
  //         }
  //         formik.setValues({
  //           ...formik.values,
  //           numeroIdentificacion,
  //           idCliente: 0,
  //           nombreComercial: nombreCompleto,
  //           nombreFiscal: nombreCompleto,
  //           direccion,
  //           emails: email,
  //           telefonos: telefono,
  //         });
  //       })
  //       .finally(() => showLoader(false));
  //   }
  // };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={customer}
      onInputChange={onSearch}
      onChange={(_, customer) => setCustomerValue(customer?.customerCompanyId)}
      getOptionLabel={(option) => option.fiscalName}
      renderInput={(params) => <TextField {...params} label="Clientes" />}
    />
  );
}
