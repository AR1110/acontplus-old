import * as React from "react";
import { CustomerReadDto } from "@/core/models";
import { customerService } from "@/core/services";
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

type SearchReturnProps = {
  setCustomerValue(customerId?: number): void;
};

export default function OrderSearch({ setCustomerValue }: SearchReturnProps) {
  const [customer, setCustomers] = useState<CustomerReadDto[]>([]);

  const onSearch = (_: any, value: string) => {
    customerSearch(value);
  };

  const customerSearch = (textSearch: string) => {
    if (textSearch.length < 2) return;
    setCustomers([]);
    customerService.search(textSearch)
      .then((response) => {
        setCustomers(response);
      })
      .finally(() => {
        console.log("finally");
      });
  };

  return (
    <React.Fragment>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={customer}
        onInputChange={onSearch}
        onChange={(_, customer) =>
          setCustomerValue(customer?.customerCompanyId)
        }
        getOptionLabel={(option) => option.fiscalName}
        renderInput={(params) => <TextField {...params} label="Buscar cliente" />}
      />
    </React.Fragment>
  );
}
