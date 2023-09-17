<script lang="ts">
  import Tabs from "$core/components/Tabs.svelte";
  import ListSupport from "../Tray/list.svelte";
  import ListInspection from "../Inspection/list.svelte";
  let items = [
    {
      label: "Bandeja",
      icon: "fa-solid fa-folder",
      value: 1,
      component: ListSupport,
    },
    {
      label: "Inspección",
      icon: "fa-solid fa-cogs",
      value: 2,
      component: ListInspection,
    }
  ];
</script>

<Tabs {items} />
