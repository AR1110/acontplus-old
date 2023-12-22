<script>
	import { goto } from '$app/navigation';
	import { GlobalRoutes } from '$constants/global-routes';
	import { getEnumValueByKey } from '$utils/constant-value';
	import { onMount } from 'svelte';
	import Header from './layout/Header.svelte';
	import Sidebar from './layout/Sidebar.svelte';
	import '../assets/css/style.css';
	import 'toastr/build/toastr.min.css';
	import './loader.css';
	import 'jquery';
	// import 'perfect-scrollbar';
	// import '../assets/js/sidebarmenu.js';
	// import '../assets/js/custom.js';
	import RightSidebar from './layout/RightSidebar.svelte';
	import Footer from './layout/Footer.svelte';
	export let url = '';
	onMount(async () => {
		// Assuming 'route' is a URL
		//   const route = '/your-route'; // replace with your route
		//   // Navigate to the route
		//   await goto(route);
		// Get the parent and child data
		const urlParams = new URLSearchParams(window.location.search);
		let token = urlParams.get('token');
		let route = urlParams.get('route');

		if (token) {
			if (localStorage.getItem('token') === '') {
				localStorage.setItem('token', token);
			}
			url = getEnumValueByKey(GlobalRoutes, route);
			goto(url);
		}
	});
</script>

<!-- <div id="main-wrapper">
	<Header></Header>
	<Sidebar></Sidebar>
	<div class="page-wrapper">
		<div class="container-fluid">
			<main>
				<slot />
			</main>
			<RightSidebar></RightSidebar>
		</div>
	</div>
	<Footer></Footer>
</div> -->

<div class="container-fluid">
	<main>
		<slot />
	</main>
</div>
