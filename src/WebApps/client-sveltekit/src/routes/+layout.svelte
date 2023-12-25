<script>
	import { goto } from '$app/navigation';
	import { GlobalRoutes } from '$constants/global-routes';
	import { getEnumValueByKey } from '$utils/constant-value';
	import { onMount } from 'svelte';
	// import Header from './layout/Header.svelte';
	// import Sidebar from './layout/Sidebar.svelte';
	// import RightSidebar from './layout/RightSidebar.svelte';
	// import Footer from './layout/Footer.svelte';
	import '../assets/css/style.css';
	import 'toastr/build/toastr.min.css';
	import 'tabulator-tables/dist/css/tabulator.min.css';
	import './loader.css';
	//import 'perfect-scrollbar/css/perfect-scrollbar.css';

	onMount(async () => {
		//libraries for template
		// const jquery = await import('jquery/dist/jquery.min.js');
		// const module = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
		// const perfect = await import('perfect-scrollbar/dist/perfect-scrollbar.min.js');
		// const waves = await import('../assets/js/waves.js');
		// const sidebarmenu = await import('../assets/js/sidebarmenu.js');
		// const sticky = await import('sticky-kit/dist/sticky-kit.min.js');
		// const sparkline = await import('jquery-sparkline/jquery.sparkline.min.js');
		// const custom = await import('../assets/js/custom.js');

		const urlParams = new URLSearchParams(window.location.search);
		let token = urlParams.get('token');
		let route = urlParams.get('route');
		if (token) {
			if (localStorage.getItem('token') === '') {
				localStorage.removeItem('token');
			}
			localStorage.setItem('token', token);
			goto(getEnumValueByKey(GlobalRoutes, route));
		}
	});
</script>

<!--full template-->
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
<!--end full template-->
<!--partial template rendering-->

<div class="container-fluid">
	<main>
		<slot />
	</main>
</div>

<!--end partial template rendering-->
