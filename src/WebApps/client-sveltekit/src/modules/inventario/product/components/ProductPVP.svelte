<script>
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { productDialogStore } from './productDialogStore';
	let tableComponent;

	const columns = [
		//define the table columns
		{ title: 'Tarifa', field: 'tarifa' },
		{
			title: 'Tipo Iva',
			field: 'porcentajeIva'
		},
		{
			title: 'Precio Venta',
			field: 'precioVenta',
			editor: true
		},
		{
			title: 'Precio IVA',
			field: 'precioConIva',
			editor: true
		},

		{
			title: '% Utilidad',
			field: 'porcentajeUtilidad',
			editor: true
		},
		{
			title: 'Utlidad',
			field: 'utilidad'
		},
		{
			title: 'Prdeterminado',
			field: 'predeterminado'
		}
	];

	let showTable = true;

	function tableAction(node, { data, columns }) {
		let table = new Tabulator(node, {
			data,
			columns,
			layout: 'fitColumns'
		});
		return {
			update: ({ data }) => {
				console.log('update test');
				table.replaceData(data);
			}
			// destroy: () => alert('bye bye table :\'(')
		};
	}

	//   onMount(() => {
	//     new Tabulator(tableComponent, {
	//       data: data, //link data to table
	//       reactiveData: true, //enable data reactivity
	//       columns: columns, //define table columns
	//     });
	//   });
</script>

<!-- <div bind:this={tableComponent} /> -->

{#if showTable}
	<div use:tableAction={{ data: $productDialogStore.productPVPs, columns }} />
{/if}
