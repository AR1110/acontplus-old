<script lang="ts">
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
  import axios from "axios";
  import { CustomerService as customerSvc } from "$lib/services/Customer/customer-service";
  import { onDestroy } from "svelte";

  export let resultCustomerSelected;

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
      let json = {
        pageIndex: 1,
        pageSize: 50,
        tipo: 1,
        textSearch: dataSearch.textSearch,
      };
      customerSvc
        .search(JSON.stringify(json), cancelToken?.token)
        .then((response) => {
          console.log(response);
          if (response) {
            customersFounded = response;
            showCustomerFounded = customersFounded.length > 0;
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

  const selectedProduct = (data: Customer) => {
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
</script>

<div id="contentCustomerSearch" style="width: 80%;">
  <AdvancedSearch
    on:input={onInput}
    on:focus={onFocus}
    on:blur={onBlur}
    value={dataSearch.textSearch}
    placeholder="Buscar Cliente"
  />

  {#if showCustomerFounded}
    <div class="floating-results list-group">
      {#each customersFounded as item}
        <a
          href={null}
          class="list-group-item"
          on:click={() => selectedProduct(item)}
        >
          <small>{item.numeroIdentificacion}</small><br />
          {item.nombreComercial}
        </a>
      {/each}
    </div>
  {/if}
</div>
