<script lang="ts">
	import { InspectionStore } from '$mechanical/store/inspection.store';
	import { InspectionService } from '$services/mechanical/inspection-service';
	import { showLoader, hideLoader } from '$utils/loading-spinner';
	import Modal from '$components/Modal.svelte';
	import toast from '$utils/toast';

	let support;
	let inspection;
	let vehicleParts;
	let engines;
	let cabin;
	let transmission;
	let brake;
	let data;
	let steering;
	let suspension;
	let lighting;
	let bearing;
	let paramValidation = [undefined, null, '', 0];

	InspectionStore.subscribe((values) => {
		inspection = values.inspection;
		support = values.support;
		if (inspection.id > 0) {
			// Motor
			engines = JSON.parse(inspection.engine);
			//cabina
			cabin = JSON.parse(inspection.cabin);
			// Sistema de Transmisión
			transmission = JSON.parse(inspection.transmission);
			// Rodamiento
			bearing = JSON.parse(inspection.bearing);
			// Sistema de Frenos
			brake = JSON.parse(inspection.brake);
			// Sistema de Dirección
			steering = JSON.parse(inspection.steering);
			// Sistema de Suspensión
			suspension = JSON.parse(inspection.suspension);
			// Sistema de luces
			lighting = JSON.parse(inspection.lighting);
		} else {
			vehicleParts = values.vehicleParts;
			// Motor
			engines = vehicleParts.filter((item) => item.codeTypePart === 'MT');

			//cabina
			cabin = vehicleParts.filter((item) => item.codeTypePart === 'CB');

			// Sistema de Transmisión
			transmission = vehicleParts.filter((item) => item.codeTypePart === 'ST');

			// Rodamiento
			bearing = vehicleParts.filter((item) => item.codeTypePart === 'RD');

			// Sistema de Frenos
			brake = vehicleParts.filter((item) => item.codeTypePart === 'SF');

			// Sistema de Dirección
			steering = vehicleParts.filter((item) => item.codeTypePart === 'SD');

			// Sistema de Suspensión
			suspension = vehicleParts.filter((item) => item.codeTypePart === 'SS');

			// Sistema de luces
			lighting = vehicleParts.filter((item) => item.codeTypePart === 'SL');
		}
	});

	// Save
	const onSave = () => {
		data = {
			engine: engines.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			cabin: cabin.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			bearing: bearing.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			transmission: transmission.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			lighting: lighting.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			brake: brake.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			steering: steering.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			suspension: suspension.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			}))
		};

		if (!onValidate()) return;

		inspection.engine = JSON.stringify(data.engine);
		inspection.cabin = JSON.stringify(data.cabin);
		inspection.bearing = JSON.stringify(data.bearing);
		inspection.transmission = JSON.stringify(data.transmission);
		inspection.lighting = JSON.stringify(data.lighting);
		inspection.brake = JSON.stringify(data.brake);
		inspection.steering = JSON.stringify(data.steering);
		inspection.suspension = JSON.stringify(data.suspension);
		inspection.supportId = support.supportId;

		showLoader();
		InspectionService.post({
			data: { inspection }
		}).then((response) => {
			hideLoader();
			if (response.code == 1) {
				toast({ type: 'success', message: response.message });
				onModalClose();
			} else {
				toast({ type: 'warning', message: response.message });
			}
		});
	};

	// Edit
	const onUpdate = () => {
		data = {
			engine: engines.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			cabin: cabin.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			bearing: bearing.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			transmission: transmission.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			lighting: lighting.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			brake: brake.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			steering: steering.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			})),

			suspension: suspension.map((item) => ({
				id: item.id,
				part: item.part,
				status: item.status,
				obs: item.obs
			}))
		};

		if (!onValidate()) return;

		inspection.engine = JSON.stringify(data.engine);
		inspection.cabin = JSON.stringify(data.cabin);
		inspection.bearing = JSON.stringify(data.bearing);
		inspection.transmission = JSON.stringify(data.transmission);
		inspection.lighting = JSON.stringify(data.lighting);
		inspection.brake = JSON.stringify(data.brake);
		inspection.steering = JSON.stringify(data.steering);
		inspection.suspension = JSON.stringify(data.suspension);
		inspection.supportId = support.supportId;

		showLoader();
		InspectionService.put(inspection.id, {
			data: { inspection }
		}).then((response) => {
			hideLoader();
			if (response.code == 1) {
				toast({ type: 'success', message: response.message });
				onModalClose();
			} else {
				toast({ type: 'warning', message: response.message });
			}
		});
	};

	// Validate Data
	const onValidate = () => {
		let isValid = true;
		let valid = false;
		try {
			for (let index in data) {
				const arr = data[index];
				if (
					arr.some(
						(tempItem) => tempItem.status == 1 || tempItem.status == 2 || tempItem.status == 3
					)
				) {
					valid = true;
				}
			}

			if (paramValidation.includes(inspection.date)) {
				toast({ type: 'warning', message: 'Ingreso la Fecha' });
				return;
			}

			if (paramValidation.includes(inspection.mileage)) {
				toast({ type: 'warning', message: 'Ingreso el kimoletraje' });
				return;
			}

			if (paramValidation.includes(inspection.fuelLevel)) {
				toast({ type: 'warning', message: 'Ingreso el nivel de Combustible' });
				return;
			}

			if (!valid) {
				toast({
					type: 'warning',
					message: 'Seleccione al menos un tipo de inspección'
				});
				return;
			}

			return isValid;
		} catch (error) {
			console.log(error);
			return false;
		}
	};

	// CLOSE MODAL
	const onModalClose = () => {
		InspectionStore.update((state) => ({
			...state,
			isOpen: false,
			vehicleParts: [],
			inspection: {
				id: 0,
				supportId: 0,
				date: new Date().toISOString().slice(0, 10),
				mileage: 0,
				fuelLevel: '',
				engine: '',
				cabin: '',
				bearing: '',
				transmission: '',
				lighting: '',
				brake: '',
				steering: '',
				suspension: '',
				obs: '',
				enabled: true
			}
		}));
	};
</script>

{#if $InspectionStore.isOpen}
	<Modal
		open={$InspectionStore.isOpen}
		iconTitle={inspection.id > 0 ? 'ti-sync' : 'ti-plus'}
		title={inspection.id > 0 ? 'Actualizar' : 'Registrar'}
		onClosed={() => onModalClose()}
		fullScreen={true}
		size={'modal-dialog-scrollable'}
	>
		<div class="modal-body">
			<form
				style="text-transform:uppercase"
				on:submit|preventDefault={inspection.id > 0 ? onUpdate : onSave}
				autocomplete="off"
			>
				<div class="row">
					<div class="col">
						<div class="form-group">
							<label for="country">Serie Documento </label>
							<input type="text" class="form-control" disabled bind:value={support.sequence} />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<label for="country">Marca </label>
							<input type="text" class="form-control" disabled bind:value={support.brand} />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<label for="country">Tipo </label>
							<input type="text" class="form-control" disabled bind:value={support.vehicleType} />
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col">
						<div class="form-group">
							<label for="country">Modelo </label>
							<input type="text" class="form-control" disabled bind:value={support.model} />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<label for="country">Color </label>
							<input type="text" class="form-control" disabled bind:value={support.color} />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<label for="country">Motor </label>
							<input type="text" class="form-control" disabled bind:value={support.engine} />
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col">
						<div class="form-group">
							<label for="country">fecha <span class="text-danger"> *</span> </label>
							<input type="date" class="form-control" bind:value={inspection.date} />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<label for="country">Kilometraje <span class="text-danger"> *</span> </label>
							<input type="number" class="form-control" bind:value={inspection.mileage} />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<label for="country">Nivel de Combustible <span class="text-danger"> *</span> </label>
							<input type="text" class="form-control" bind:value={inspection.fuelLevel} />
						</div>
					</div>
				</div>
				<hr />
				<div id="accordion">
					<!-- Motor -->
					<div class="card">
						<div class="card-header p-3 mb-2 bg-info" id="heading1">
							<center>
								<b>
									<h5 class="mb-0">
										<button
											class="btn btn-info"
											data-toggle="collapse"
											data-target="#collapse1"
											aria-expanded="true"
											aria-controls="collapse1"
											type="button"
										>
											<i class="ti-plus" /> MOTOR
										</button>
									</h5>
								</b>
							</center>
						</div>

						<div
							id="collapse1"
							class="collapse"
							aria-labelledby="heading1"
							data-parent="#accordion"
						>
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="thead-dark">
											<tr>
												<th>item</th>
												<th class="text-center">Bueno</th>
												<th class="text-center">Regular</th>
												<th class="text-center">Malo</th>
												<th class="text-center">Observación</th>
											</tr>
										</thead>
										<tbody>
											{#each engines as item}
												<tr>
													<td width="35%">{item.part}</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox1{item.id}"
																name="inlineCheckbox{item.id}"
																value={1}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox1{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox2{item.id}"
																name="inlineCheckbox{item.id}"
																value={2}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox2{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox3{item.id}"
																name="inlineCheckbox{item.id}"
																value={3}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox3{item.id}" />
														</div>
													</td>
													<td width="50%" class="text-center"
														><div class="col-12 col-sm-12 col-md-12 col-lg-12">
															<input type="text" class="form-control" bind:value={item.obs} />
														</div></td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<!-- Cabina -->
					<div class="card">
						<div class="card-header p-3 mb-2 bg-info" id="heading2">
							<h5 class="mb-0">
								<center>
									<button
										class="btn btn-info"
										data-toggle="collapse"
										data-target="#collapse2"
										aria-expanded="false"
										aria-controls="collapse2"
										type="button"
									>
										<i class="ti-plus" /> CABINA
									</button>
								</center>
							</h5>
						</div>

						<div
							id="collapse2"
							class="collapse"
							aria-labelledby="heading2"
							data-parent="#accordion"
						>
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="thead-dark">
											<tr>
												<th>item</th>
												<th class="text-center">Bueno</th>
												<th class="text-center">Regular</th>
												<th class="text-center">Malo</th>
												<th class="text-center">Observación</th>
											</tr>
										</thead>
										<tbody>
											{#each cabin as item}
												<tr>
													<td width="35%">{item.part}</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox1{item.id}"
																name="inlineCheckbox{item.id}"
																value={1}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox1{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox2{item.id}"
																name="inlineCheckbox{item.id}"
																value={2}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox2{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox3{item.id}"
																name="inlineCheckbox{item.id}"
																value={3}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox3{item.id}" />
														</div>
													</td>
													<td width="50%" class="text-center"
														><div class="col-12 col-sm-12 col-md-12 col-lg-12">
															<input type="text" class="form-control" bind:value={item.obs} />
														</div></td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<!-- Rodamiento -->
					<div class="card">
						<div class="card-header p-3 mb-2 bg-info" id="heading3">
							<h5 class="mb-0">
								<center>
									<button
										class="btn btn-info"
										data-toggle="collapse"
										data-target="#collapse3"
										aria-expanded="false"
										aria-controls="collapse3"
										type="button"
									>
										<i class="ti-plus" /> RODAMIENTO
									</button>
								</center>
							</h5>
						</div>

						<div
							id="collapse3"
							class="collapse"
							aria-labelledby="heading3"
							data-parent="#accordion"
						>
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="thead-dark">
											<tr>
												<th>item</th>
												<th class="text-center">Bueno</th>
												<th class="text-center">Regular</th>
												<th class="text-center">Malo</th>
												<th class="text-center">Observación</th>
											</tr>
										</thead>
										<tbody>
											{#each bearing as item}
												<tr>
													<td width="35%">{item.part}</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox1{item.id}"
																name="inlineCheckbox{item.id}"
																value={1}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox1{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox2{item.id}"
																name="inlineCheckbox{item.id}"
																value={2}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox2{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox3{item.id}"
																name="inlineCheckbox{item.id}"
																value={3}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox3{item.id}" />
														</div>
													</td>
													<td width="50%" class="text-center"
														><div class="col-12 col-sm-12 col-md-12 col-lg-12">
															<input type="text" class="form-control" bind:value={item.obs} />
														</div></td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<!-- Sistema de Transmision -->
					<div class="card">
						<div class="card-header p-3 mb-2 bg-info" id="heading4">
							<h5 class="mb-0">
								<center>
									<button
										class="btn btn-info"
										data-toggle="collapse"
										data-target="#collapse4"
										aria-expanded="false"
										aria-controls="collapse4"
										type="button"
									>
										<i class="ti-plus" /> SISTEMA DE TRANSMISIÓN
									</button>
								</center>
							</h5>
						</div>

						<div id="collapse4" class="collapse" aria-labelledby="heading" data-parent="#accordion">
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="thead-dark">
											<tr>
												<th>item</th>
												<th class="text-center">Bueno</th>
												<th class="text-center">Regular</th>
												<th class="text-center">Malo</th>
												<th class="text-center">Observación</th>
											</tr>
										</thead>
										<tbody>
											{#each transmission as item}
												<tr>
													<td width="35%">{item.part}</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox1{item.id}"
																name="inlineCheckbox{item.id}"
																value={1}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox1{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox2{item.id}"
																name="inlineCheckbox{item.id}"
																value={2}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox2{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox3{item.id}"
																name="inlineCheckbox{item.id}"
																value={3}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox3{item.id}" />
														</div>
													</td>
													<td width="50%" class="text-center"
														><div class="col-12 col-sm-12 col-md-12 col-lg-12">
															<input type="text" class="form-control" bind:value={item.obs} />
														</div></td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<!-- Sistema de Luces -->
					<div class="card">
						<div class="card-header p-3 mb-2 bg-info" id="heading5">
							<h5 class="mb-0">
								<center>
									<button
										class="btn btn-info"
										data-toggle="collapse"
										data-target="#collapse5"
										aria-expanded="false"
										aria-controls="collapse5"
										type="button"
									>
										<i class="ti-plus" /> SISTEMA DE LUCES
									</button>
								</center>
							</h5>
						</div>

						<div
							id="collapse5"
							class="collapse"
							aria-labelledby="heading5"
							data-parent="#accordion"
						>
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="thead-dark">
											<tr>
												<th>item</th>
												<th class="text-center">Bueno</th>
												<th class="text-center">Regular</th>
												<th class="text-center">Malo</th>
												<th class="text-center">Observación</th>
											</tr>
										</thead>
										<tbody>
											{#each lighting as item}
												<tr>
													<td width="35%">{item.part}</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox1{item.id}"
																name="inlineCheckbox{item.id}"
																value={1}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox1{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox2{item.id}"
																name="inlineCheckbox{item.id}"
																value={2}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox2{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox3{item.id}"
																name="inlineCheckbox{item.id}"
																value={3}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox3{item.id}" />
														</div>
													</td>
													<td width="50%" class="text-center"
														><div class="col-12 col-sm-12 col-md-12 col-lg-12">
															<input type="text" class="form-control" bind:value={item.obs} />
														</div></td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<!-- Sistema de Frenos -->
					<div class="card">
						<div class="card-header p-3 mb-2 bg-info" id="heading6">
							<h5 class="mb-0">
								<center>
									<button
										class="btn btn-info"
										data-toggle="collapse"
										data-target="#collapse6"
										aria-expanded="false"
										aria-controls="collapse6"
										type="button"
									>
										<i class="ti-plus" /> SISTEMA DE FRENOS
									</button>
								</center>
							</h5>
						</div>

						<div
							id="collapse6"
							class="collapse"
							aria-labelledby="heading6"
							data-parent="#accordion"
						>
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="thead-dark">
											<tr>
												<th>item</th>
												<th class="text-center">Bueno</th>
												<th class="text-center">Regular</th>
												<th class="text-center">Malo</th>
												<th class="text-center">Observación</th>
											</tr>
										</thead>
										<tbody>
											{#each brake as item}
												<tr>
													<td width="35%">{item.part}</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox1{item.id}"
																name="inlineCheckbox{item.id}"
																value={1}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox1{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox2{item.id}"
																name="inlineCheckbox{item.id}"
																value={2}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox2{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox3{item.id}"
																name="inlineCheckbox{item.id}"
																value={3}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox3{item.id}" />
														</div>
													</td>
													<td width="50%" class="text-center"
														><div class="col-12 col-sm-12 col-md-12 col-lg-12">
															<input type="text" class="form-control" bind:value={item.obs} />
														</div></td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<!-- Sistema de Direccion -->
					<div class="card">
						<div class="card-header p-3 mb-2 bg-info" id="heading7">
							<h5 class="mb-0">
								<center>
									<button
										class="btn btn-info"
										data-toggle="collapse"
										data-target="#collapse7"
										aria-expanded="false"
										aria-controls="collapse7"
										type="button"
									>
										<i class="ti-plus" /> SISTEMA DE DIRECCIÓN
									</button>
								</center>
							</h5>
						</div>

						<div
							id="collapse7"
							class="collapse"
							aria-labelledby="heading7"
							data-parent="#accordion"
						>
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="thead-dark">
											<tr>
												<th>item</th>
												<th class="text-center">Bueno</th>
												<th class="text-center">Regular</th>
												<th class="text-center">Malo</th>
												<th class="text-center">Observación</th>
											</tr>
										</thead>
										<tbody>
											{#each steering as item}
												<tr>
													<td width="35%">{item.part}</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox1{item.id}"
																name="inlineCheckbox{item.id}"
																value={1}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox1{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox2{item.id}"
																name="inlineCheckbox{item.id}"
																value={2}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox2{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox3{item.id}"
																name="inlineCheckbox{item.id}"
																value={3}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox3{item.id}" />
														</div>
													</td>
													<td width="50%" class="text-center"
														><div class="col-12 col-sm-12 col-md-12 col-lg-12">
															<input type="text" class="form-control" bind:value={item.obs} />
														</div></td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<!-- Sistema de Suspension -->
					<div class="card">
						<div class="card-header p-3 mb-2 bg-info" id="heading8">
							<h5 class="mb-0">
								<center>
									<button
										class="btn btn-info"
										data-toggle="collapse"
										data-target="#collapse8"
										aria-expanded="false"
										aria-controls="collapse8"
										type="button"
									>
										<i class="ti-plus" /> SISTEMA DE SUSPENSIÓN
									</button>
								</center>
							</h5>
						</div>

						<div
							id="collapse8"
							class="collapse"
							aria-labelledby="heading8"
							data-parent="#accordion"
						>
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="thead-dark">
											<tr>
												<th>item</th>
												<th class="text-center">Bueno</th>
												<th class="text-center">Regular</th>
												<th class="text-center">Malo</th>
												<th class="text-center">Observación</th>
											</tr>
										</thead>
										<tbody>
											{#each suspension as item}
												<tr>
													<td width="35%">{item.part}</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox1{item.id}"
																name="inlineCheckbox{item.id}"
																value={1}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox1{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox2{item.id}"
																name="inlineCheckbox{item.id}"
																value={2}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox2{item.id}" />
														</div>
													</td>
													<td width="5%" class="text-center"
														><div class="checkbox icheck-primary">
															<input
																class="form-check-input"
																type="radio"
																id="inlineCheckbox3{item.id}"
																name="inlineCheckbox{item.id}"
																value={3}
																bind:group={item.status}
															/>
															<label class="form-check-label" for="inlineCheckbox3{item.id}" />
														</div>
													</td>
													<td width="50%" class="text-center"
														><div class="col-12 col-sm-12 col-md-12 col-lg-12">
															<input type="text" class="form-control" bind:value={item.obs} />
														</div></td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<hr />

				<div class="row">
					<div class="col">
						<div class="form-group">
							<label for="country">Obs </label>
							<input type="text" class="form-control" bind:value={inspection.obs} />
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<button type="submit" class="btn btn-success"> <i class="ti-save" /> Guardar</button>
					<button type="button" class="btn btn-dark" on:click={() => onModalClose()}
						>&times; Cerrar</button
					>
				</div>
			</form>
		</div>
	</Modal>
{/if}
