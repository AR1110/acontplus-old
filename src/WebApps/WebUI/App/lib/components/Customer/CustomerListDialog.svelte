<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { CustomerService } from "$lib/services/Customer/customer-service";
  import { hideLoader, showLoader } from "$utils/loading-spinner";
  import { TabulatorFull as Tabulator } from "tabulator-tables";

  export let open = false;
  export let onClosed;
  let title = "Listado de Clientes";

  type Customer = {
    index: number;
    idCliente: number;
    idTipoIdentificacion: number;
    numeroIdentificacion: string;
    nombreFiscal: string;
    nombreComercial: string;
    direccion: string;
    telefono: string;
    correo?: string;
    consumidorFinal: false;
    validationSri: false;
    tipoIdentificacion: string;
    estado: boolean;
    totalRecords: number;
  };
  let dataSearch = {
    pageIndex: 1,
    pageSize: 50,
    maxSize: 5,
    textSearch: null,
  };

  let customers: Array<Customer> = [];

  const columns = [
    //define the table columns
    { title: "N°", field: "index", width: 50 },
    {
      title: "C.I./RUC",
      field: "numeroIdentificacion",
      width: 150,
    },
    {
      title: "Nombre Comercial",
      field: "nombreComercial",
      width: 200,
    },
    {
      title: "Dirección",
      field: "direccion",
      width: 200,
    },

    {
      title: "Teléfono",
      field: "telefono",
      width: 200,
    },
  ];

  const getCustomers = () => {
    try {
      const json = {
        pageIndex: dataSearch.pageIndex,
        pageSize: dataSearch.pageSize,
        checkTextSearch: dataSearch.textSearch ? true : false,
        textSearch: dataSearch.textSearch,
      };
      showLoader();
      CustomerService.getAll(json)
        .then((response) => {
          if (response) {
            let tempCustomers: Array<Customer> = response[0];
            customers = tempCustomers.map((customer, index) => ({
              ...customer,
              index: index + 1,
            }));
          }
        })
        .finally(() => hideLoader());
    } catch (error) {
      console.log(error);
    }
  };

  onMount(() => {
    getCustomers();
  });

  const searchCustomer = (e) => {
    try {
      let textSearch: string = e.target.value;

      dataSearch = {
        ...dataSearch,
        textSearch,
      };
      getCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  function tableAction(node, { data, columns }) {
    let table = new Tabulator(node, {
      selectable: 1,
      selectableRollingSelection: true, // disable rolling selection
      data,
      height: "400px",
      columns,
      layout: "fitColumns",
    });
    table.on("rowClick", function (e, row) {
      var rowData = row.getData();
      console.log(rowData);
    });
    return {
      update: ({ data }) => {
        table.replaceData(data);
      },
      rowClick: () => {
        console.log("oiheoifhor");
      },
    };
  }

  const modalClose = (data) => {
    open = false;
    if (onClosed) {
      onClosed(data);
    }
  };
</script>

{#if open}
  <div
    class="modal"
    id="customerListDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="customerListDialogLabel"
    aria-hidden={false}
  >
    <div
      class="modal-dialog modal-lg"
      role="document"
      in:fly={{ y: -50, duration: 300 }}
      out:fly={{ y: -50, duration: 300, easing: quintOut }}
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="customerListDialogLabel">{title}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            on:click={() => modalClose("close")}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-end">
            <div class="p-0">
              <input
                type="text"
                class="form-control border-select"
                on:keyup={searchCustomer}
                placeholder="Buscar cliente"
              />
            </div>
          </div>
          <div use:tableAction={{ data: customers, columns }} />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-dark"
            data-dismiss="modal"
            on:click={() => modalClose("close")}>&times; Cerrar</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    display: block;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
