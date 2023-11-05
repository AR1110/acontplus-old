<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import { onMount } from "svelte";
  import Add from "./components/add.svelte";
  import List from "./components/list.svelte";
  import { estabAsignService } from "$lib/services/restaurant/estab-asign-service";
  import { tableService } from "$lib/services/restaurant/table-service";
  import SelectEstablecimiento from "../Components/SelectEstablecimiento.svelte";
  import { hideLoader, showLoader } from "$lib/utils/loading-spinner";
  import type { Room } from "$lib/interfaces/restaurant/room";
  import { roomService } from "$lib/services/restaurant/room-service";
  let title = "Mesas";

  // Modal management
  let establecimientos = [];
  let codEstab = "";
  let tables = [];
  let rooms = [] as Room[];
  let isNew = false;

  onMount(() => {
    getCodEstab();
  });

  const getCodEstab = () => {
    showLoader();
    estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      hideLoader();
      if (response) {
        establecimientos = response;
        codEstab = establecimientos[0].codEstab;
        getTable(codEstab);
        getRooms(codEstab);
      }
    });
  };

  const getTable = (codEstab) => {
    showLoader();
    tableService.get(codEstab).then((response) => {
      hideLoader();
      if (response) {
        tables = response;
      }
    });
  };

  let getRooms = (codEstab: string) => {
    roomService.getByCode(codEstab).then((response) => {
      if (response) {
        rooms = response;
      }
    });
  };

  const openNew = () => {
    if (openNew) {
      isNew = true;
    }
  };

  const closeModal = () => {
    isNew = false;
    reloadList();
  };

  const reloadList = () => {
    getTable(codEstab);
  };

  const changeEstab = (codEstab) => {
    getTable(codEstab);
  };
</script>

<Breadcrumbs {title} action={"Nueva"} openNew={() => openNew()} />
<SelectEstablecimiento {establecimientos} {changeEstab} />
<List {reloadList} {tables} {rooms} />
<Add openNew={isNew} modalClosed={() => closeModal()} {rooms} />
