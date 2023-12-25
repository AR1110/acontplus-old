<script lang="ts">
	import Switch from '$components/Switch.svelte';
	import { client } from '$utils/axiosClient';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import { options } from 'toastr';

	let url = 'Config/EmailConfig/';

	type Data = {
		idEmailConfig: number;
		enableSsl: boolean;
		from: string;
		host: string;
		password: string;
		port: 0;
	};
	let data: Data = {
		idEmailConfig: 0,
		enableSsl: false,
		from: '',
		host: '',
		password: '',
		port: 0
	};

	let onLoad = function () {
		try {
			client.get(url + 'Get?json=' + JSON.stringify({ tipo: 1 })).then((response: any) => {
				if (response.code === '0') {
					console.log(response);
				}
				if (response.code === '1') {
					data = JSON.parse(response.payload)[0][0];
				}
			});
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		onLoad();
	});

	let askToSave = async function () {
		try {
			const swalWithBootstrapButtons = Swal.mixin({
				customClass: {
					confirmButton: 'btn btn-success',
					cancelButton: 'btn btn-danger ml-2'
				},
				buttonsStyling: false
			});

			swalWithBootstrapButtons
				.fire({
					text: 'Esta seguro de actualizar los parametros de Email!',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Actualizar',
					cancelButtonText: 'Cancelar',
					reverseButtons: false
				})
				.then((result) => {
					if (result.isConfirmed) {
						client
							.put(url + '?id=' + data.idEmailConfig, { data })
							.then((response: any) => {
								if (response.code === '0') {
									swalWithBootstrapButtons.fire('', response.message, 'warning');
								}
								if (response.code === '1') {
									swalWithBootstrapButtons.fire('', response.message, 'success');
									onLoad();
								}
							})
							.catch((error) => {
								console.log(error);
							});
					}
				});
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="row mt-3 mb-3">
	<div class="col-6">
		<div class="card card-body">
			<h4 class="card-title">Parametros Email</h4>
			<h5 class="card-subtitle">
				<span class="text-danger">*</span> Ingrese todos los campos requeridos
			</h5>
			<hr />
			<div class="row">
				<div class="col-sm-12 col-xs-12">
					<form on:submit={() => askToSave()} autocomplete="off">
						<div class="form-group">
							<label for="EnableSsl">EnableSsl <span class="text-danger">*</span> </label>
							<Switch bind:checked={data.enableSsl} />
						</div>
						<div class="form-group">
							<label for="from">From <span class="text-danger">*</span></label>
							<input
								type="text"
								class="form-control"
								bind:value={data.from}
								id="from"
								placeholder="..."
								required
							/>
						</div>
						<div class="form-group">
							<label for="host">Host <span class="text-danger">*</span></label>
							<input
								type="text"
								class="form-control"
								bind:value={data.host}
								id="host"
								placeholder="..."
								required
							/>
						</div>
						<div class="form-group">
							<label for="password">Password <span class="text-danger">*</span></label>
							<input
								type="text"
								class="form-control"
								bind:value={data.password}
								id="password"
								placeholder="..."
								required
							/>
						</div>

						<div class="form-group">
							<label for="port">port <span class="text-danger">*</span></label>
							<input
								type="text"
								class="form-control"
								bind:value={data.port}
								id="port"
								placeholder="..."
								required
							/>
						</div>

						<button type="submit" class="btn btn-success">
							<i class="ti-save" /> Guardar
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
