<script lang="ts">
    import { onMount } from "svelte";
    import { RecipeService } from "@/lib/services/restaurant/recipe-service";
    let recipes = [];
    onMount(() => {
        RecipeService.get(JSON.stringify({ tipo: 1 })).then((response) => {
            console.log(response);
            if (response) {
                //recipes = response["recipes"];
            }
        });
    });
</script>
{#if recipes.length > 0}
    <div class="table">
        <table class="table">
            <thead>
                <tr>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each recipes as item}
                    <td>{item.title}</td>
                {/each}
            </tbody>
        </table>
    </div>
{:else}
    <h5>No se encontraron registros</h5>
{/if}
