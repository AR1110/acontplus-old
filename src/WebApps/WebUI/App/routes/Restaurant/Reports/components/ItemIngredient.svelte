<script lang="ts">


const getReport = ()=>{
  console.log('report')
}

</script>

<form autocomplete="off">
  <div class="row">
    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
      <div class="form-group">
        <label for="product-search">Producto</label>
        <input
          type="text"
          class="form-control border-select"
          name="product-search"
          id="product-search"
        />
      </div>
    </div>
    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
      <div class="form-group">
        <label for="categoria-search">Categoría</label>
        <select
          name="categoria-search"
          id="categoria-search"
          class="form-control border-select"
        >
          <option value="" />
        </select>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-12">
      <div class="form-group">
        <label for="exportTo">Exportar a:</label>
      </div>
      <div class="form-group">
        <div class="btn-group btn-group-lg" role="group">
          <button type="button" class="btn btn-info" on:click={getReport}>PDF</button>
          <button type="button" class="btn btn-success">Excel</button>
        </div>
      </div>
    </div>
  </div>
</form>

<style>
  .border-select:focus {
    border-color: blue !important;
  }
</style>
