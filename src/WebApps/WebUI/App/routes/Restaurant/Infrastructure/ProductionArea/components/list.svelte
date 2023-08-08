<script lang="ts">
  import { productionAreaService } from '$core/services/preoduction-area-service';
  import { onMount } from 'svelte';

  let productionAreas = [];

  onMount(() => {
    productionAreaService.get().then((res) => {
      if (res) {
        productionAreas = res;
      }
    });
  });
</script>
