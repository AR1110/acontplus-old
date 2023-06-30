<script>
    //see more https://svelte.dev/repl/e67e1a90ef3945ec988bf39f6a10b6b3?version=3.32.3
    export let searchTerm;
    export let placeholder;
</script>

<div class="row">
    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
        <div id="search-input-cont" class="form-group">
            <input
                type="text"
                id="search-field"
                class="form-control"
                {placeholder}
                autocomplete="off"
                bind:value={searchTerm}
                on:input
            />
        </div>
    </div>
</div>
