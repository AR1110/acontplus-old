<script lang="ts">
  export let recordsQuantity;
  export let select;
</script>

<span class="form-group pull-left page-size form-inline">
  <select class="form-control control-color" on:change={(e) => select(e)} >
    {#each recordsQuantity as record}
      <option value={record}>{record}</option>
    {/each}
  </select>
</span>
