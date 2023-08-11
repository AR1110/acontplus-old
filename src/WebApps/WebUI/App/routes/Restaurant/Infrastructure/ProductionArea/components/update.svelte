<script lang="ts">
	import Modal from "$core/components/Modal.svelte";
	import type { ProductionArea } from "$core/interfaces/restaurant/production-area";
	import { productionAreaService } from "$core/services/restaurant/production-area-service";
	import toast from "$core/utils/toast";

	export let openNew;
	export let modalClosed;
	export let data = {} as ProductionArea;

	const onUpdate = () => {
		productionAreaService.put(data.id, data).then((response) => {
			if (response.status >= 200 && response.status < 300) {
				modalClosed();
				toast({ type: "success", message: "Actualizado exitosamente" });
				return window.location.reload();
			} else {
				console.log(response);
				toast({ type: "error", message: "Error al actualizar" });
			}
		});
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
		iconTitle={"ti-sync"}
		title={"Actualizar"}
		onClosed={() => onModalClose()}
	>
		<form on:submit|preventDefault={onUpdate} autocomplete="off">
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
