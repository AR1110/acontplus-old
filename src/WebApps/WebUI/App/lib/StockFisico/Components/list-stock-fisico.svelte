<script>
    import { onMount } from "svelte";
    import { StockFisicoService } from "$core/services/stok-fisico-service";
    let stocksFisicos = [];
    onMount(() => {
        StockFisicoService.get(JSON.stringify({ tipo: 2 })).then((response) => {
            console.log(response);
            if (response) {
                stocksFisicos = response['table'];
            }
        });
    });
</script>

<div class="card">
    <div class="card-body">
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    {#if stocksFisicos.length}
                        <table>
                            <thead>
                                <tr>
                                    <th>N°. Documento</th>
                                    <th>Fecha Emisión</th>
                                    <th>Observación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each stocksFisicos as item}
                                    <tr>
                                        <td>{item.secuencial}</td>
                                        <td>{item.fecha}</td>
                                        <td>{item.obs}</td>
                                    </tr>
                                {/each}
                            </tbody>
                            <!-- <tfoot>
                            <tr>
                                <td colspan="6"><strong>Total:</strong></td>
                                <td>{{ total }}</td>
                            </tr>
                        </tfoot> -->
                        </table>
                    {:else}
                        <h5>No se encontraron</h5>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
