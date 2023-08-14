<script lang="ts">
	import Modal from "$core/components/Modal.svelte";
	import toast from "$core/utils/toast";
	import type { Floor } from "$core/interfaces/restaurant/floor";
	import { floorService } from "$core/services/restaurant/floor-service";
	import { onMount } from "svelte";
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";

	export let openNew;
	export let modalClosed;

	export let data = {} as Floor;
	let establecimientos = [];

	onMount(() => {
		getEstabAsign();
	});

	const getEstabAsign = () => {
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			if (response) {
				establecimientos = response;
			}
		});
	};

	const onSave = () => {
		if (!onValidate(data)) return;

		floorService.post(data).then((response) => {
			debugger;
			if (response.status == 200) {
				onModalClose();
				toast({ type: "success", message: response.data });
				data = {} as Floor;
			} else {
				toast({ type: "warning", message: response.data });
			}
		});
	};

	const onUpdate = () => {
		if (!onValidate(data)) return;

		floorService.put(data.id, data).then((response) => {
			if (response.status == 200) {
				onModalClose();
				toast({ type: "success", message: "Actualizado exitosamente" });
				data = {} as Floor;
			} else {
				toast({ type: "error", message: "Error al actualizar" });
			}
		});
	};

	const onValidate = (data: Floor) => {
		let isValid = true;

		try {
			if (data.codEstab === undefined || data.codEstab === null) {
				toast({
					type: "warning",
					message: "Seleccione un establecimiento",
				});
				isValid = false;
			}

			if (data.description === undefined || data.description === null) {
				toast({ type: "warning", message: "Ingrese una descripción" });
				isValid = false;
			}

			if (data.code === undefined || data.code === null) {
				toast({ type: "warning", message: "Ingrese un código" });
				isValid = false;
			}

			if (data.capacity === undefined || data.capacity === null) {
				toast({ type: "warning", message: "Ingrese una capacidad" });
				isValid = false;
			}
			return isValid;
		} catch (error) {
			console.log(error);
			return false;
		}
	};

	const setCode = (description: string) => {
		if (description === undefined || description === null) return;
		data.code = description.substring(0, 3).toUpperCase();
	};

	const onModalClose = () => {
		openNew = false;
		modalClosed();
	};
</script>

{#if openNew}
	<Modal
		open={openNew}
		iconTitle={data.id > 0 ? "ti-sync" : "ti-plus"}
		title={data.id > 0 ? "Actualizar" : "Registrar"}
		onClosed={() => onModalClose()}
	>
		<form
			on:submit|preventDefault={data.id > 0 ? onUpdate : onSave}
			autocomplete="off"
		>
			<div class="modal-body">
				<div class="form-group">
					<label for="tipo"
						>Establecimiento.: <span class="text-danger">*</span
						></label
					>
					<select
						name="establecimiento"
						id="establecimiento"
						class="form-control border-select"
						bind:value={data.codEstab}
					>
						{#each establecimientos as item}
							<option value={item.codEstab}>
								{item.nombreComercial}
							</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label for="descripcion">
						Descripción <span class="text-danger">*</span>
					</label>
					<input
						type="text"
						name="description"
						id="description"
						bind:value={data.description}
						on:keyup={(e) => setCode(data.description)}
						class="form-control border-select"
					/>
				</div>
				<div class="form-group">
					<label for="descripcion">
						Código <span class="text-danger">*</span>
					</label>
					<input
						type="text"
						name="code"
						id="code"
						bind:value={data.code}
						class="form-control border-select"
					/>
				</div>
				<div class="form-group">
					<label for="descripcion">
						Capacidad <span class="text-danger">*</span>
					</label>
					<input
						type="number"
						name="capacity"
						id="capacity"
						bind:value={data.capacity}
						class="form-control border-select"
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button type="submit" class="btn btn-success">
					<i class="ti-save" /> Guardar</button
				>
				<button
					type="button"
					class="btn btn-dark"
					on:click={() => onModalClose()}>&times; Cerrar</button
				>
			</div>
		</form>
	</Modal>
{/if}
