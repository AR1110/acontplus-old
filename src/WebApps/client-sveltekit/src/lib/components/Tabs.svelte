<script>
	export let items = [];
	export let activeTabValue = 1;
	// const handleClick = (tabValue) => () => (activeTabValue = tabValue);
	// const handleKeyDowm = (tabValue) => (activeTabValue = tabValue);
</script>

<ul class="nav nav-tabs" id="myTab" role="tablist">
	{#each items as item}
		<li class="nav-item">
			<a
				class="nav-link {activeTabValue === item.value ? 'active' : ''}"
				id="{item.value}-tab"
				data-toggle="tab"
				href={item.value}
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
