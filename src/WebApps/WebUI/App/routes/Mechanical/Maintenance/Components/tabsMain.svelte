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
      label: "Mantenimiento",
      icon: "fa fa-wrench",
      value: 2,
      component: ListMaintenance,
    },
    {
      label: "Inspección",
      icon: "fa fa-file-text",
      value: 3,
      component: ListInspection,
    }
  ];
</script>

<Tabs {items} />
