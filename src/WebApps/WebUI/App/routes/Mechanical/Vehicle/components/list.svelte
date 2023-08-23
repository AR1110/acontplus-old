<script lang="ts">
  import { onMount } from "svelte";
  import toast from "$core/utils/toast";
  import Swal from "sweetalert2";
  import Search from "$core/components/Search.svelte";
  import type { Vehicle } from "$core/interfaces/Mechanical/vehicle";
  import type { Customer } from "$core/interfaces/customer/customer";
  import { VehicleService } from "$core/services/Mechanical/vehicle-service";
  import Add from "./add.svelte";

  //Test event 
  // import { setContext } from "svelte"
  // import { writable } from "svelte/store"
  //Test event 

  export let reloadList;

  let vehicle = {} as Vehicle;
  let customer = {} as Customer;
  let isNew = false;
  let searchTerm = "";
  let filteredVehicles = [];
  let vehicles = [];

  onMount(async () => {
    await getVehicles();
    
  });

  // List Vehicles
  const getVehicles = () => {
    VehicleService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      if (response) {
        vehicles = response["vehicles"];
      }
    });
  };
  
  //GetId for Edit
  const editItem = (item) => {
    VehicleService.get(JSON.stringify({ tipo: 3, id: item.id })).then(
      (response) => {
        if (response) {
          customer = response["customer"][0];
          vehicle = response["vehicle"][0];
          isNew = true;
        }
      }
    );
  };

  //Status Vehicle
  const putState = (id, state) => {
    VehicleService.putState(id, state).then((response) => {
      if (response.status == 200) {
        toast({ type: "success", message: response.data });
      } else {
        toast({ type: "error", message: response.data });
      }
    });
  };

  //Remove or Delete
  const remove = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cerrar",
    }).then((result) => {
      if (result.isConfirmed) {
        VehicleService.remove(id).then((response) => {
          if (response.code == 1) {
            toast({ type: "success", message: response.message });
          } else {
            toast({ type: "warning", message: response.message });
          }
          reloadList();
        });
      }
    });
  };

  const searchVehicle = () => {
    return (filteredVehicles = vehicles.filter((vehicle) => {
      let vehicleLicence = vehicle.name.toLowerCase();
      return vehicleLicence.includes(searchTerm.toLowerCase());
    }));
  };

  const closeModal = () => {
    isNew = false;
    reloadList();
  };
</script>

<Search
  bind:searchTerm
  on:input={searchVehicle}
  placeholder="Buscar Vehículo"
/>
<div class="card">
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>T. Vehículo</th>
            <th>Placa</th>
            <th>Cliente / Conductor</th>
            <th>Indentificación</th>
            <th>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#if searchTerm && filteredVehicles.length === 0}
            <h5>No se encontraron resultados</h5>
          {:else if filteredVehicles.length > 0}
            {#each filteredVehicles as item}
              <tr>
                <td>{item.vehicleType}</td>
                <td>{item.licensePlate}</td>
                <td>{item.tradeName}</td>
                <td>{item.idCard}</td>
                <td>
                  <div class="custom-control custom-switch text-warning">
                    <input
                      type="checkbox"
                      bind:checked={item.enabled}
                      class="custom-control-input"
                      id="switch{item.id}"
                    />
                    <label class="custom-control-label" for="switch{item.id}" />
                  </div>
                </td>
                <td>
                  <button class="btn btn-outline-danger btn-sm">
                    <i class="ti-trash" />
                  </button>
                  <button class="btn btn-outline-warning btn-sm">
                    <i class="ti-pencil" />
                  </button>
                </td>
              </tr>
            {/each}
          {:else}
            {#each vehicles as item}
              <tr>
                <td
                  ><i
                    class={item.icon}
                    style="color:{item.color};"
                    aria-hidden="true"
                  />
                  {item.vehicleType}</td
                >
                <td>{item.licensePlate}</td>
                <td>{item.tradeName}</td>
                <td>{item.idCard}</td>
                <td>
                  <div class="custom-control custom-switch text-warning">
                    <input
                      type="checkbox"
                      bind:checked={item.enabled}
                      on:click={() => putState(item.id, item.enabled)}
                      class="custom-control-input"
                      id="switch{item.id}"
                    />
                    <label class="custom-control-label" for="switch{item.id}" />
                  </div>
                </td>
                <td>
                  <button
                    class="btn btn-outline-danger btn-sm"
                    on:click={() => remove(item.id)}
                  >
                    <i class="ti-trash" />
                  </button>
                  <button
                    class="btn btn-outline-warning btn-sm"
                    on:click={() => editItem(item)}
                  >
                    <i class="ti-pencil" />
                  </button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
<Add openNew={isNew} modalClosed={() => closeModal()} {vehicle} {customer} />
