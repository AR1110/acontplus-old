<script lang="ts">
  export let search;

  const clearInput = () => {
    document.querySelector("input").value = "";
    search({ target: { value: "" } });
  };
</script>

<!-- Search component -->
<div class="container">
  <div class="row">
    <div class="col-8" />
    <div class="col-4">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control form-control-lg search-input"
          placeholder="Buscar..."
          aria-label=""
          aria-describedby="basic-addon1"
          on:keyup={(e) => { search(e); }}
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            on:click={() => { clearInput(); }}
            type="button"><i class="fa fa-sync" /></button
          >
        </div>
      </div>
    </div>
  </div>
</div>
