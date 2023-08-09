<script>
  export let items = [];
  export let activeTabValue = 1;
  const handleClick = (tabValue) => () => (activeTabValue = tabValue);
  const handleKeyDowm = (tabValue) => (activeTabValue = tabValue);
</script>

<ul class="nav nav-tabs" id="myTab" role="tablist">
  {#each items as item}
    <li class="nav-item">
      <a
        class="nav-link {activeTabValue === item.value ? 'active' : ''}"
        id="{item.value}-tab"
        data-toggle="tab"
        href="#{item.value}"
        role="tab"
        aria-controls={item.value}
        aria-expanded="true"
        on:click={handleClick(item.value)}
        on:keydown={handleKeyDowm(item.value)}
        ><span class="hidden-sm-up">
          {#if item.icon}
            <i class={item.icon} />
          {/if}</span
        >
        <span class="hidden-xs-down">{item.label}</span></a
      >
      <!-- <span
        role="tab"
        on:click={handleClick(item.value)}
        on:keydown={handleKeyDowm(item.value)}
        tabindex="0"
      >
        {#if item.icon}
          <i class={item.icon} />
        {/if}{item.label}
      </span> -->
    </li>
  {/each}
</ul>
{#each items as item}
  {#if activeTabValue == item.value}
    <div class="tab-content">
      <div
        class="tab-pane {activeTabValue === item.value ? 'active' : ''} p-10"
        id="tab-pane-{item.value}"
        role="tabpanel"
      >
        <svelte:component this={item.component} />
      </div>
    </div>
  {/if}
{/each}

<!-- <style>
  .box {
    margin-bottom: 10px;
    padding: 40px;
    border: 1px solid #dee2e6;
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    margin-bottom: -1px;
  }

  span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
</style> -->
