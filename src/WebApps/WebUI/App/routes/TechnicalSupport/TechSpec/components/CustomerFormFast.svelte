<script lang="ts">
  import { onMount } from "svelte";
  import { CustomerService as customerSvc } from "$lib/services/Customer/customer-service";

  onMount(() => {
    customerSvc.getDataForm().then((response) => {
      console.log(response);
    });
  });
</script>

<div class="row">
  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
    <div class="form-group">
      <label for=""
        >Tipo Identificación: <span class="text-danger">*</span>
      </label>
      <div class="input-group">
        <div class="input-group-prepend">
          <select class="form-control border-select" name="tipoDocumento">
            <option />
          </select>
        </div>
        <input
          type="text"
          class="form-control border-select"
          name="numeroIdentificacion"
          id="numeroIdentificacion"
          placeholder="Ej: 2105234568"
        />
        <small class="invalid-feedback text-right">grftg </small>
        <small class="valid-feedback text-right">gfrg </small>
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
    <div class="form-group">
      <label for="nombreFiscal"
        >Nombre Fiscal: <span class="text-danger">*</span></label
      >
      <input
        type="text"
        class="form-control border-select"
        name="nombreFiscal"
        id="nombreComercial"
        placeholder="Ej: TECNOMEGA"
      />
    </div>
  </div>
</div>
