<script lang="ts">
  import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
  import { estabAsignService } from "$core/services/restaurant/estab-asign-service";
  import { onMount } from "svelte";
  import Add from "./componets/add.svelte";
  import List from "./componets/list.svelte";
  import { roomService } from "$core/services/restaurant/room-service";
  import SelectEstablecimiento from "../Components/SelectEstablecimiento.svelte";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import { floorService } from "$core/services/restaurant/floor-service";
  import type { Floor } from "$core/interfaces/restaurant/floor";

  let establecimientos = [];
  let rooms = [];
  let floors = [] as Floor[];

  let isNew = false;
  let codEstab = "";

  onMount(async () => {
    getCodEstab();
  });

  const getCodEstab = () => {
    showLoader();
    estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      hideLoader();
      if (response) {
        establecimientos = response;
        codEstab = establecimientos[0].codEstab;
        getRooms(codEstab);
        getFloors(codEstab);
      }
    });
  };

  const getRooms = (codEstab: string) => {
    if (!isExistCodEstab(codEstab)) return;

    showLoader();
    roomService.getByCode(codEstab).then((response) => {
      hideLoader();
      if (response) {
        rooms = response;
      }
    });
  };

  const getFloors = (codEstab) => {
    floorService.getByCode(codEstab).then((response) => {
      if (response) {
        floors = response;
      }
    });
  };

  const isExistCodEstab = (codEstab: string) => {
    if (codEstab === undefined || codEstab === null || codEstab === "") {
      return false;
    }
    return true;
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
    getRooms(codEstab);
  };

  const changeEstab = (codEstab) => {
    getRooms(codEstab);
  };
</script>

<Breadcrumbs title={"Salas"} action={"Nueva"} openNew={() => openNew()} />

<SelectEstablecimiento {establecimientos} {changeEstab} />
<List {reloadList} {rooms} />
<Add openNew={isNew} modalClosed={() => closeModal()} floors={floors} />
