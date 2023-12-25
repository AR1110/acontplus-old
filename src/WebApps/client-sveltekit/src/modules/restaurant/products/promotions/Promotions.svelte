<script lang="ts">
	import { usePromotionStore } from '$restaurant/store/promotionStore';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import Add from './Components/Add.svelte';
	import List from './Components/List.svelte';

</script>

<!-- <Breadcrumbs
	title={'Promociones'}
	action={'Nueva promoción'}
	openNew={() => usePromotionStore.openingModal()}
/> -->

<List />
<Add />
