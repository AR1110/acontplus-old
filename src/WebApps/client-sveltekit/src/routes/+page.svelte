<script>
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Dashboard from '$home/dashboard/Dashboard.svelte';
</script>

<svelte:head>
	<title>Acontplus</title>
	<meta name="description" content="Acontplus" />
</svelte:head>
<Dashboard></Dashboard>