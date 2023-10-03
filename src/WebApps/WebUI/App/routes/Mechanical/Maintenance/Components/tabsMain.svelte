<script lang="ts">
  import Tabs from "$lib/components/Tabs.svelte";
  import ListSupport from "../Tray/list.svelte";
  import ListInspection from "../Inspection/list.svelte";
  import ListMaintenance from "../Maintenance/list.svelte";
  let items = [
    {
      label: "Bandeja",
      icon: "fa-solid fa-folder",
      value: 1,
      component: ListSupport,
    },
    {
      label: "Inspección",
      icon: "fa fa-file-text",
      value: 2,
      component: ListInspection,
    },
    {
      label: "Mantenimiento",
      icon: "fa fa-wrench",
      value: 3,
      component: ListMaintenance,
    },
  ];
</script>

<Tabs {items} />
