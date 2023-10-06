<script lang="ts">
  import { onDestroy } from "svelte";
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
  import axios from "axios";
  import { CustomerService as customerSvc } from "$lib/services/Customer/customer-service";
  import tS from "$utils/toast";
  import { hideLoader, showLoader } from "$utils/loading-spinner";
  export let resultCustomerSelected; //()=>void

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
  let isFindedCustomer = false; //Para validar busqueda de datos del cliente a SRI
  let showCustomerFounded = false;
  let customersFounded: Array<Customer> = [];
  let cancelToken;
  let dataSearch = {
    textSearch: "",
  };

  const onInput = async (e) => {
    dataSearch.textSearch = e.target.value;
    customersFounded = [];

    if (dataSearch.textSearch.length < 2) return;

    // Check if we made a request
    if (cancelToken) {
      // Cancel the previous request before making a new request
      cancelToken.cancel("mensaje de cancelación");
    }
    // Create a new CancelToken
    cancelToken = axios.CancelToken.source();
    try {
      isFindedCustomer = false;

      let json = {
        pageIndex: 1,
        pageSize: 50,
        tipo: 1,
        textSearch: dataSearch.textSearch,
      };
      customerSvc
        .search(JSON.stringify(json), cancelToken?.token)
        .then((response) => { 
          if (response) {
            customersFounded = response;
            showCustomerFounded = customersFounded.length > 0;
            isFindedCustomer = customersFounded.length > 0;
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
    showCustomerFounded = customersFounded.length > 0;
  };

  const onBlur = () => {
    //showProductsFound = false;
  };

  const selectedCustomer = (data: Customer) => {
    dataSearch.textSearch = data.nombreFiscal;
    resultCustomerSelected(data.idCliente);
    showCustomerFounded = false;
  };

  // Función para manejar clics en el documento
  function handleClickArea(event) {
    const miDiv = document.getElementById("contentCustomerSearch");
    if (miDiv && !miDiv.contains(event.target)) {
      showCustomerFounded = false;
    }
  }

  // Agrega un event listener para escuchar clics en el documento
  document.addEventListener("click", handleClickArea);
  // Elimina el event listener cuando el componente se destruye
  onDestroy(() => {
    document.removeEventListener("click", handleClickArea);
  });

  function validationIDNumber(numero: string) {
    numero = numero ? numero.trim() : "";
    if (![10, 13].includes(numero.length)) return;

    if (isNaN(parseInt(numero))) return;

    if (numero.length === 13 && numero.slice(-3) !== "001") return;
    return true;
  }

  const serachCustomerToSRI = (event) => {
    if (event.key !== "Enter") return;
    if (isFindedCustomer) return;

    if (!validationIDNumber(dataSearch.textSearch)) {
      tS({
        type: "warning",
        message: "Ingrese número de identificación correcta!",
      });
      return;
    }

    if (dataSearch.textSearch.length === 13) {
      showLoader();
      customerSvc
        .getRuc(dataSearch.textSearch)
        .then((response) => {
          let { numeroRuc, razonSocial, direccion, telefono, email, error } =
            response;
          if (!numeroRuc) {
            tS({
              type: "warning",
              message: error,
            });
            return;
          }
          const result = {
            nombreFiscal: razonSocial,
            numeroIdentificacion: numeroRuc,
            identificacionComprador: numeroRuc,
            razonSocialComprador: razonSocial,
            nombreComercial: razonSocial,
            direccionComprador: direccion || null,
            telefono: telefono || null,
            email: email || null,
            idCliente: 0,
          };
          resultCustomerSelected(result, "DATASRI");
        })
        .finally(() => hideLoader());
    }
    if (dataSearch.textSearch.length === 10) {
      showLoader();
      customerSvc
        .getCedula(dataSearch.textSearch)
        .then((response) => {
          let {
            identificacion,
            nombreCompleto,
            direccion,
            telefono,
            email,
            error,
          } = response;
          if (!identificacion || !nombreCompleto) {
            tS({
              type: "warning",
              message: error,
            });
            return;
          }

          const result = {
            nombreFiscal: nombreCompleto,
            numeroIdentificacion: identificacion,
            identificacionComprador: identificacion,
            razonSocialComprador: nombreCompleto,
            nombreComercial: nombreCompleto,
            direccionComprador: direccion || null,
            telefono: telefono || null,
            email: email || null,
            idCliente: 0,
          };
          resultCustomerSelected(result, "DATASRI");
        })
        .finally(() => hideLoader());
    }
  };
</script>

<div id="contentCustomerSearch" style="width: 80%;">
  <AdvancedSearch
    on:input={onInput}
    on:focus={onFocus}
    on:blur={onBlur}
    on:keydown={serachCustomerToSRI}
    value={dataSearch.textSearch}
    placeholder="Buscar Cliente"
  />

  {#if showCustomerFounded}
    <div class="floating-results list-group">
      {#each customersFounded as item}
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
