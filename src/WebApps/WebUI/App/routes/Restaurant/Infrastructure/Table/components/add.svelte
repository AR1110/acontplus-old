<script lang="ts">
	import Modal from "$core/components/Modal.svelte";
	import type { Room } from "$core/interfaces/restaurant/room";
	import type { Table } from "$core/interfaces/restaurant/table";
	import { roomService } from "$core/services/restaurant/room-service";
	import { tableService } from "$core/services/restaurant/table-service";
	import toast from "$core/utils/toast";
	import { onMount } from "svelte";

	export let openNew;
	export let modalClosed;

	export let data = {} as Table;
	let rooms = [] as Room[];

	onMount(() => {
		getRooms();
	});

	let getRooms = () => {
		roomService.get().then((response) => {
			if (response) {
				rooms = response;
			}
		});
	};

	const onSave = () => {
		if (!onValidate(data)) return;

		tableService.post(data).then((response) => {
			debugger;
			if (response.status == 200) {
				onModalClose();
				toast({ type: "success", message: response.data });
				data = {} as Table;
			} else {
				toast({ type: "warning", message: response.data });
			}
		});
	};

	const onUpdate = () => {
		if (!onValidate(data)) return;

		tableService.put(data.id, data).then((response) => {
			if (response.status == 200) {
				onModalClose();
				toast({ type: "success", message: "Actualizado exitosamente" });
				data = {} as Table;
			} else {
				toast({ type: "error", message: "Error al actualizar" });
			}
		});
	};

	const onValidate = (data: Table) => {
		let isValid = true;

		try {
			if (data.roomId === undefined || data.roomId === null) {
				toast({ type: "warning", message: "Seleccione la sala" });
				isValid = false;
			}

			if (data.numberTable === undefined || data.numberTable === null) {
				toast({
					type: "warning",
					message: "Seleccione el número de la tabla",
				});
				isValid = false;
			}

			if (data.description === undefined || data.description === null) {
				toast({ type: "warning", message: "Ingrese una descripción" });
				isValid = false;
			}

			if (data.capacity === undefined || data.capacity === null) {
				toast({ type: "warning", message: "Ingrese una capacidad" });
				isValid = false;
			}
			return isValid;
		} catch (error) {
			return false;
		}
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
		title={data.id > 0 ? "Actualizar mesa" : "Registrar mesa"}
		onClosed={() => onModalClose()}
	>
		<form
			on:submit|preventDefault={data.id > 0 ? onUpdate : onSave}
			autocomplete="off"
		>
			<div class="modal-body">
				<div class="form-group">
					<label for="tipo"
						>Sala: <span class="text-danger">*</span></label
					>
					<select
						name="room"
						id="room"
						class="form-control border-select"
						bind:value={data.roomId}
					>
						<option disabled>seleccione ítem</option>
						{#each rooms as item}
							<option value={item.id}>
								{`${item.description} - ${item.code}`}
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
						class="form-control border-select"
					/>
				</div>
				<div class="form-group">
					<label for="descripcion">
						Número de mesa <span class="text-danger">*</span>
					</label>
					<input
						type="number"
						name="numberTable"
						id="numberTable"
						bind:value={data.numberTable}
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
