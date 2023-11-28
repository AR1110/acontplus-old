<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import flatpickr from "flatpickr";
  import axios from "axios";
  import "flatpickr/dist/flatpickr.min.css";
  import { cuentaPorCobrarService as cuentaPorCobrarSvc } from "$routes/ventas/services/cuenta-por-cobrar.service";
  import { showLoader, hideLoader } from "$utils/loading-spinner";
  import { getFirstDayOfMonth, getLastDayOfMonth } from "$utils/utils";
  import { sharedService as sharedSvc } from "$lib/services";
  import toast from "$lib/utils/toast";
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";

  import { CustomerService as customerSvc } from "$lib/services/Customer/customer-service";

  type PtoEmi = {
    idPuntoEmision: number;
    ptoEmi: string;
    defaultPtoEmi: boolean;
  };
  type Estab = {
    idEstablecimiento: number;
    nombreComercial: string;
    codEstab: string;
    defaultEstab: boolean;
    puntosEmision: Array<PtoEmi>;
  };
  type EstadoDoc = {
    idEstadoPago: number;
    descripcion: string;
    codigo: string;
  };

  type Customer = {
    idCliente: number;
    idTipoIdentificacion: number;
    nombreFiscal: string;
    nombreComercial: string;
    numeroIdentificacion: string;
    tipoIdentificacion: string;
    codigoSri: string;
    customerId: number;
  };

  let estabs: Array<Estab> = [];
  let puntosEmision: Array<PtoEmi> = [];
  let estadosDoc: Array<EstadoDoc> = [];

  let dataSearch = {
    codEstab: "",
    idPuntoEmision: 0,
    ckFecha: true,
    fechaInicio: getFirstDayOfMonth(),
    fechaFin: getLastDayOfMonth(),
    idCliente: 0,
    codEstado: "",
    ckCxcVencida: false,
  };

  let cancelToken;
  let customers: Array<Customer> = [];
  let showCustomersFounded = false;
  let dataSearchCustomer = {
    nombreComercial: "",
    textSearch: "",
  };

  const initiload = () => {
    showLoader();
    cuentaPorCobrarSvc
      .get({ tipo: 6 })
      .then((response) => {
        estabs = response.estabs;
        estadosDoc = response.estadosDoc;
        console.log(estadosDoc);
        let dataEstab = estabs.find((estab) => estab.defaultEstab);
        puntosEmision = dataEstab.puntosEmision;
        let dataPuntoEmision = puntosEmision.find(
          (ptoEmi) => ptoEmi.defaultPtoEmi
        );
        dataSearch.codEstab = dataEstab.codEstab;
        dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
        console.log(puntosEmision);
        if (estadosDoc.length > 0) {
          dataSearch.codEstado = estadosDoc.find(
            (estado) => estado.codigo === "NCBR"
          ).codigo;
        }
      })
      .finally(() => hideLoader());
  };

  onMount(() => {
    flatpickr("#daterange", {
      mode: "range",
      dateFormat: "Y-m-d h:i K", // Customize the date format as needed
      defaultDate: [dataSearch.fechaInicio, dataSearch.fechaFin],
      allowInput: true,
      onChange: (selectedDates) => {
        let [fechaInicio, fechaFin] = selectedDates;
        if (fechaInicio) {
          dataSearch.fechaInicio = fechaInicio;
          //flatpickr.formatDate(fechaInicio, "Y-m-d h:i K")
        }
        if (fechaFin) {
          dataSearch.fechaFin = fechaFin;
        }
        console.log(dataSearch);
      },
    });
    initiload();
  });

  const onChangeEstab = () => {
    let dataEstab = estabs.find(
      (estab) => estab.codEstab === dataSearch.codEstab
    );
    puntosEmision = dataEstab.puntosEmision;
    if (puntosEmision.length > 0) {
      dataSearch.idPuntoEmision = puntosEmision.find(
        (pto) => pto.defaultPtoEmi
      ).idPuntoEmision;
    } else {
      toast({
        type: "warning",
        message: "No tienes asignados puntos de emisión!",
      });
      dataSearch.idPuntoEmision = 0;
    }
  };

  // Función para manejar clics en el documento
  function handleClickArea(event) {
    const miDiv = document.getElementById("contentCustomerSearch");
    if (miDiv && !miDiv.contains(event.target)) {
      showCustomersFounded = false;
    }
  }

  // Agrega un event listener para escuchar clics en el documento
  document.addEventListener("click", handleClickArea);
  // Elimina el event listener cuando el componente se destruye
  onDestroy(() => {
    document.removeEventListener("click", handleClickArea);
  });

  const onInput = async (e) => {
    dataSearchCustomer.textSearch = e.target.value;
    customers = [];

    if (dataSearchCustomer.textSearch.length < 2) return;

    // Check if we made a request
    if (cancelToken) {
      // Cancel the previous request before making a new request
      cancelToken.cancel("mensaje de cancelación");
    }
    // Create a new CancelToken
    cancelToken = axios.CancelToken.source();
    try {
      showCustomersFounded = false;
      dataSearch.ckCxcVencida = false;

      let json = {
        pageIndex: 1,
        pageSize: 50,
        tipo: 1,
        textSearch: dataSearchCustomer.textSearch,
      };
      customerSvc
        .search(JSON.stringify(json), cancelToken?.token)
        .then((response) => {
          if (response) {
            customers = response;
            showCustomersFounded = customers.length > 0;
          }
        });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.log("Something went wrong: ", error.message);
      }
    }
  };

  const onFocus = () => {
    showCustomersFounded = customers.length > 0;
  };

  const selectedCustomer = (data: Customer) => {
    dataSearchCustomer.textSearch = data.nombreFiscal;
    dataSearch.idCliente = data.idCliente;
    showCustomersFounded = false;
  };
  const getReport = (format: "excel" | "pdf") => {
    let dataParams = {
      tipo: 1,
      ckFecha: dataSearch.ckFecha,
      codEstab: dataSearch.codEstab,
      idCliente: dataSearch.idCliente,
      codEstado: dataSearch.codEstado || null,
      fechaInicio: flatpickr.formatDate(dataSearch.fechaInicio, "Y-m-d h:i K"),
      fechaFin: flatpickr.formatDate(dataSearch.fechaFin, "Y-m-d h:i K"),
      ckCxcVencida: dataSearch.ckCxcVencida,
    };
    console.log(dataParams);
    const parameters = {
      hasIdUsuarioRol: true,
      reportParams: JSON.stringify({
        hasParams: false,
        codigo: dataSearch.ckCxcVencida ? "CCCR" : "CCR",
        format: format,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(dataParams),
    };
    console.log(parameters);
    sharedSvc.download(parameters);
  };
</script>

<div class="card">
  <div class="card-body">
    <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-6 col-12">
        <div class="form-group">
          <label for="estabs">Estab: <span class="text-danger">*</span></label>
          <select
            name="estabs"
            id="estabs"
            class="form-control border-select"
            bind:value={dataSearch.codEstab}
            on:change={onChangeEstab}
          >
            {#each estabs as estab}
              <option value={estab.codEstab}>
                {estab.nombreComercial}
              </option>
            {/each}
          </select>
        </div>
      </div>
      <div class="col-lg-2 col-md-2 col-sm-6 col-12">
        <div class="form-group">
          <label for="estabs"
            >Pto. emisión: <span class="text-danger">*</span></label
          >
          <select
            name="estabs"
            id="estabs"
            class="form-control border-select"
            bind:value={dataSearch.idPuntoEmision}
          >
            {#each puntosEmision as ptoEmi}
              <option value={ptoEmi.idPuntoEmision}> {ptoEmi.ptoEmi}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-6 col-12">
        <div class="form-froup">
          <label for="daterange">Rango de fechas: </label>
          <input
            type="text"
            id="daterange"
            placeholder="..."
            class="form-control border-select"
          />
        </div>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 col-12">
        <div class="form-group">
          <label for="estadosDoc">Estado:</label>
          <select
            name="estadosDoc"
            id="estadosDoc"
            bind:value={dataSearch.codEstado}
            class="form-control border-select"
          >
            <option value={""}>Todos</option>
            {#each estadosDoc as estado}
              <option value={estado.codigo}> {estado.descripcion}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6 col-md-6 col-sm-12 col-12">
        <div class="form-group" id="contentCustomerSearch">
          <label for="customer-search"
            >Cliente:
            <small class="text-success"
              >{dataSearchCustomer.nombreComercial}</small
            >
          </label>
          <div class="input-group">
            <AdvancedSearch
              on:input={onInput}
              on:focus={onFocus}
              value={dataSearchCustomer.textSearch}
              placeholder="..."
            />
            <div class="input-group-append">
              <button
                class="btn btn-danger"
                type="button"
                on:click={() => {
                  dataSearchCustomer.textSearch = "";
                  dataSearch.idCliente = 0;
                  showCustomersFounded = false;
                }}>&times;</button
              >
            </div>
          </div>

          {#if showCustomersFounded}
            <div class="floating-results list-group">
              {#each customers as item}
                <a
                  href={null}
                  class="list-group-item"
                  on:click={() => selectedCustomer(item)}
                >
                  <small>{item.numeroIdentificacion}</small><br />
                  {item.nombreComercial}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-12">
        <!-- {#if dataSearch.idCliente > 0} -->
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="ckCxcVencida"
              bind:checked={dataSearch.ckCxcVencida}
            />
            <label class="custom-control-label" for="ckCxcVencida"
              >Movimientos</label
            >
          </div>
          <!-- <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <div class="custom-control custom-checkbox mr-sm-2">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="ckCxcVencida"
                    bind:checked={dataSearch.ckCxcVencida}
                  />
                  <label class="custom-control-label" for="ckCxcVencida" />
                </div>
              </div>
            </div>
            <input
              type="text"
              class="form-control"
              aria-label="Text input with checkbox"
            />
          </div> -->
        <!-- {/if} -->
      </div>
    </div>
  </div>
  <div class="card-footer">
    <button class="btn btn-success" on:click={() => getReport("pdf")}>
      <i class="mdi mdi-file-pdf" />
      PDF
    </button>
    <button class="btn btn-info" on:click={() => getReport("excel")}>
      <i class="mdi mdi-file-excel" />
      Excel
    </button>
  </div>
</div>
