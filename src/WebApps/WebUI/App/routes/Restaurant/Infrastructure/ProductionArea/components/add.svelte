<script lang="ts">
	import { productionAreaService } from "$core/services/restaurant/production-area-service";
	import Modal from "$core/components/Modal.svelte";
	import type { ProductionArea } from "$core/interfaces/restaurant/production-area";
	import toast from "$core/utils/toast";

	export let openNew;
	export let modalClosed;
	export let data = {} as ProductionArea;

	const onSave = () => {
		if (!onValidate()) return;

		productionAreaService.post(data).then((response) => {
			if (response.status == 200) {
				onModalClose();
				data = {} as ProductionArea;
				toast({ type: "success", message: response.data });
			} else {
				toast({ type: "error", message: response.data });
			}
		});
	};

	const onUpdate = () => {
		if (!onValidate()) return;

		productionAreaService.put(data.id, data).then((response) => {
			if (response.status == 200) {
				onModalClose();
				data = {} as ProductionArea;
				toast({ type: "success", message: response.data });
			} else {
				toast({ type: "error", message: response.data });
			}
		});
	};

	const setCode = (description: string) => {
		if (description === undefined || description === null) return;

		data.code = description.substring(0, 3).toUpperCase();
	};

	const onValidate = () => {
		if (data.description === undefined || data.description === null) {
			toast({ type: "error", message: "Ingrese la descripción" });
			return false;
		}

		if (data.code === undefined || data.code === null) {
			toast({ type: "error", message: "Ingrese el código" });
			return false;
		}

		return true;
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
		title={data.id ? "Actualizar" : "Registrar"}
		onClosed={() => onModalClose()}
	>
		<form
			on:submit|preventDefault={data.id > 0 ? onUpdate : onSave}
			autocomplete="off"
		>
			<div class="modal-body">
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
