<script>
  export let title;
  export let openNew;
  export let action;
  export let select;
  export let establecimientos;
  export let selectEstab;
</script>

<div class="row page-titles">
  <div class="col-md-5 align-self-center">
    <h5 class="text-themecolor">{title}</h5>
  </div>
  {#if openNew}
    <div class="col-md-7 align-self-center text-right">
      <div class="d-flex justify-content-end align-items-center">
        {#if select}
        <div class="col-md-6 align-self-center text-right">
          <div class="d-flex justify-content-end align-items-center">
            <select class="form-control" id="select">
              {#each establecimientos as item}
                <option on:change={selectEstab} value={item.codEstab}>{item.nombreComercial}</option>
              {/each}
            </select>
          </div>
        </div>
      {/if}
        <button
          type="button"
          on:click={() => openNew()}
          class="btn btn-info d-block d-lg-inline-block m-l-15"
        >
          <i class="fa fa-plus-circle" />
          {action}
        </button>
      </div>
    </div>
  {/if}
</div>
