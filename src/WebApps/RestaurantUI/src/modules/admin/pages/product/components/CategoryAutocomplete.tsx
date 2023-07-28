import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useProductContext } from "../context";
import { useFormikContext } from "formik";
import React from "react";

export default function CategoryAutocomplete() {
	const { productState } = useProductContext();
	const dataFormApi = productState.dataFormApi;
	const formik = useFormikContext();
	const values = formik["values"] as typeof productState["data"];

	if (dataFormApi.categories.length === 0) return <p>Cargando...</p>

	return (
		<Autocomplete
			size="small"
			clearOnEscape
			value={dataFormApi.categories.find((option) => option.idSubFamilia === values.idSubFamilia ?? null) || null}
			onChange={(event: React.SyntheticEvent<Element, Event>, value) => {
				formik.setFieldValue('idSubFamilia', value?.idSubFamilia);
			}}
			options={dataFormApi.categories}
			groupBy={(option) => option.familia}
			getOptionLabel={(option) => (option.subFamilia ? option.subFamilia : '')}
			isOptionEqualToValue={(option, value) => option.idSubFamilia === value.idSubFamilia}
			fullWidth
			renderInput={(params) => <TextField   {...params} label="Categorias" name="idSubFamilia" id="idSubFamilia" />}
		/>
	)
}
