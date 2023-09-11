<script>
  import { IngredientService } from "$core/services/restaurant/ingredient-service";
  import ItemsList from "./items-list.svelte";
  import toast from "$core/utils/toast";

  export let setOnChange;
  let filteredCountries = [];
  let ingredientes = [];
  let timer;

  const searchIngredients = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      ingredientes = [];
      if (inputValue) {
        let query = { textSearch: inputValue, tipo: 2 };

        IngredientService.get(JSON.stringify(query))
          .then((res) => {
            if (res) {
              ingredientes = res["ingredients"];

              if (ingredientes.length === 0) {
                toast({
                  type: "warning",
                  message: "No se encontraron ingredientes",
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
            toast({ type: "warning", message: "Ups, algo salió mal" });
          });
      }
    }, 750);
  };

  $: filteredCountries = ingredientes;

  /* HANDLING THE INPUT */
  let searchInput; // use with bind:this to focus element
  let inputValue = "";

  $: if (!inputValue) {
    filteredCountries = [];
    hiLiteIndex = null;
  }

  const clearInput = () => {
    inputValue = "";
    searchInput.focus();
  };

  const setInputVal = (ingredient) => {
    setOnChange(ingredient);
    inputValue = removeBold(ingredient);
    filteredCountries = [];
    hiLiteIndex = null;
    document.querySelector("#country-input").focus();
  };

  const submitValue = () => {
    if (inputValue) {
      setTimeout(clearInput, 1000);
    } else {
      console.log("You didn't type anything.");
    }
  };

  const removeBold = (str) => {
    return str.summary.replace(/<(.)*?>/g, "");
  };

  /* NAVIGATING OVER THE LIST OF COUNTRIES W HIGHLIGHTING */
  let hiLiteIndex = null;
  //$: console.log(hiLiteIndex);
  $: hiLitedCountry = filteredCountries[hiLiteIndex];

  const navigateList = (e) => {
    if (e.key === "ArrowDown" && hiLiteIndex <= filteredCountries.length - 1) {
      hiLiteIndex === null ? (hiLiteIndex = 0) : (hiLiteIndex += 1);
    } else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
      hiLiteIndex === 0
        ? (hiLiteIndex = filteredCountries.length - 1)
        : (hiLiteIndex -= 1);
    } else if (e.key === "Enter") {
      setInputVal(filteredCountries[hiLiteIndex]);
    } else {
      return;
    }
  };
</script>

<svelte:window on:keydown={navigateList} />

<form autocomplete="off" on:submit|preventDefault={submitValue}>
  <div class="autocomplete">
    <input
      id="country-input"
      type="text"
      placeholder="Buscar ingredientes"
      bind:this={searchInput}
      bind:value={inputValue}
      on:input={searchIngredients}
    />
  </div>

  <!-- FILTERED LIST OF COUNTRIES -->
  {#if filteredCountries.length > 0}
    <ul id="autocomplete-items-list">
      {#each filteredCountries as country, i}
        <ItemsList
          itemLabel={country}
          highlighted={i === hiLiteIndex}
          on:click={() => setInputVal(country)}
        />
      {/each}
    </ul>
  {/if}
</form>

<style>
  div.autocomplete {
    /*the container must be positioned relative:*/
    position: relative;
    display: inline-block;
    width: 100%;
  }
  input {
    border: 1px solid transparent;
    background-color: #f1f1f1;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    margin: 0;
    width: auto;
  }
  input[type="text"] {
    background-color: #f1f1f1;
    width: 100%;
  }

  #autocomplete-items-list {
    position: relative;
    margin: 0;
    padding: 0;
    top: 0;
    width: 297px;
    border: 1px solid #ddd;
    background-color: #ddd;
    z-index: 99;
  }
</style>
