<script lang="ts">
    import { onMount } from "svelte";
    import { SubcategoriaService } from "$contabilidad/services/subcategoria-service";
    let subcategorias = [];
    onMount(() => {
      SubcategoriaService.get(JSON.stringify({ tipo: 1 })).then((response) => {
        if (response) {
          subcategorias = response[0];
          console.log(subcategorias);
        }
      });
    });
  </script>
  
  <div class="card">
    <div class="card-body">
      {#if subcategorias.length > 0}
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripcion</th>
                
              </tr>
            </thead>
            <tbody>
              {#each subcategorias as item}
                <tr>
                  <td>{item.codigo}</td>
                  <td>{item.descripcion}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <h5>No hay registros</h5>
      {/if}
    </div>
  </div>
  