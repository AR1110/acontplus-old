<script lang="ts">
    import { onMount } from "svelte";
    import { MenuService } from "$core/services/restaurant/menu-service";
    let menus = [];
    onMount(() => {
        MenuService.get(JSON.stringify({ tipo: 1 })).then((response) => {
            console.log(response);
            if (response) {
                //menus = response["menus"];
            }
        });
    });
</script>
{#if menus.length > 0}
    <div class="table">
        <table class="table">
            <thead>
                <tr>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each menus as item}
                    <td>{item.title}</td>
                {/each}
            </tbody>
        </table>
    </div>
{:else}
    <h5>No se encontraron registros</h5>
{/if}
