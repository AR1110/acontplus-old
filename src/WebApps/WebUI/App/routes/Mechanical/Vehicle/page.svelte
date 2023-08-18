<script lang="ts">
    import { hideLoader, showLoader } from './../../../core/utils/loading-spinner.js';
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { onMount } from "svelte";
    import Add from '$routes/Mechanical/Vehicle/components/add.svelte';

    let isNew = false;

    const openNew = () => {
		if (openNew) {
			isNew = true;
		}
	};
</script>

<Breadcrumbs title= {"Vehículos"} action= {"Nuevo"} openNew= {()=> openNew()}/>
<Add />