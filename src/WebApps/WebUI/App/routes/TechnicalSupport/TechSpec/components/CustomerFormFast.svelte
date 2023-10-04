<script lang="ts">
  import { onMount } from "svelte";

  import {
    activeShowForm,
    techSpecCustomerStore,
    getDataForm,
    copiarNombreComercial,
    save,
  } from "./../../store/techSpecCustomerStore";

  $: dataForm = $techSpecCustomerStore.dataForm;
  $: data = $techSpecCustomerStore.data;

  onMount(() => {
    getDataForm();
  });
</script>

<div class="row">
  <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
    <div class="form-group">
      <label for=""
        >Tipo Identificación: <span class="text-danger">*</span>
      </label>
      <div class="input-group">
        <div class="input-group-prepend">
          <select
            class="form-control border-select"
            name="tipoDocumento"
            bind:value={data.idTipoIdentificacion}
          >
            {#each dataForm.tiposIdentificacion as data}
              <option value={data.idTipoIdentificacion}
                >{data.descripcion}</option
              >
            {/each}
          </select>
        </div>
        <input
          type="text"
          class="form-control border-select"
          name="numeroIdentificacion"
          id="numeroIdentificacion"
          placeholder="Ej: 2105234568"
          bind:value={data.numeroIdentificacion}
        />
        <small class="invalid-feedback text-right">grftg </small>
        <small class="valid-feedback text-right">gfrg </small>
      </div>
    </div>
  </div>
  <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
    <div class="form-group">
      <label for="nombreFiscal"
        >Nombre Fiscal: <span class="text-danger">*</span></label
      >
      <input
        type="text"
        class="form-control border-select"
        name="nombreFiscal"
        id="nombreFiscal"
        placeholder="Ej: TECNOMEGA"
        on:change={copiarNombreComercial}
        bind:value={data.nombreFiscal}
      />
    </div>
  </div>
</div>

<div class="row">
  <div class="col-lg-12 col-md-12 col-sm-12 col-12">
    <div class="form-group">
      <label for="address">Dirección</label>
      <input
        type="text"
        class="form-control border-select"
        placeholder="AV. 09 DE OCTUBRE..."
        bind:value={data.direccion}
      />
    </div>
  </div>
</div>

<div class="row">
  <div class="col-xl-6 col-md-6 col-sm-6 col-12">
    <div class="form-group">
      <label for="emails">Email: </label>
      <input
        type="text"
        class="form-control border-select"
        placeholder="example1@gmail;example2@gmail.com"
        bind:value={data.correo}
      />
    </div>
  </div>
  <div class="col-xl-6 col-md-6 col-sm-6 col-12">
    <div class="form-group">
      <label for="phoneNumbers">Telefono: </label>
      <input
        type="text"
        class="form-control border-select"
        placeholder="0959889786;0969784562"
        bind:value={data.telefono}
      />
    </div>
  </div>
</div>

<div class="d-inline-flex justify-content-center flex-row mb-3">
  <div class="p-2">
    <button type="button" class="btn btn-info" on:click={save}>
      {#if data.idCliente > 0}
        <i class="ti-pencil" /> Actualizar
      {:else}
        <i class="ti-save" /> Guardar
      {/if}
    </button>
  </div>
  <div class="p-2">
    <button
      type="button"
      class="btn btn-danger"
      on:click={() => activeShowForm("CLOSE")}
    >
      &times; Cerrar
    </button>
  </div>
</div>
