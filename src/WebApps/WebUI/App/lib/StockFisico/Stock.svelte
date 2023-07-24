<script type="ts">
    let editStatus = false,
        showPopup = false;
    import ModalNuevo from "./Components/ModalNuevo.svelte";

    const openNew = (open) => {
        showPopup = open;
        if (!open && editStatus) {
            editStatus = false;
            //clean();
        } else {
        }
    };

    const onPopupClose = (data) => {
		showPopup = false;

		console.log(data);
	}
</script>

<div class="row page-titles">
    <div class="col-md-5 align-self-center">
        <h5 class="text-themecolor">Stock Físico</h5>
    </div>
    <div class="col-md-7 align-self-center text-right">
        <div class="d-flex justify-content-end align-items-center">
            <button
                type="button"
                on:click={() => openNew(true)}
                class="btn btn-info d-block d-lg-inline-block m-l-15"
            >
                <i class="fa fa-plus-circle" /> Nuevo
            </button>
        </div>
    </div>
</div>
<!-- {#if showForm}
    <ModalNuevo />
{/if} -->

<ModalNuevo showModal={showPopup} onModalClose={(data) => onPopupClose(data)} />

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th />
                        <th>N°</th>
                        <th>N°. Documento</th>
                        <th>Fecha Emisión</th>
                        <th>Observación</th>
                        <th>Usuario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- <tr>
                        <td />
                        <td />
                        <td>{item.nroDoc}</td>
                        <td>{item.fechaEmision}</td>
                        <td>{item.observacion}</td>
                        <td>{item.usuario}</td>
                        <td>${item.total}</td>
                    </tr> -->
                </tbody>
                <!-- <tfoot>
                    <tr>
                        <td colspan="6"><strong>Total:</strong></td>
                        <td>{{ total }}</td>
                    </tr>
                </tfoot> -->
            </table>
        </div>
    </div>
</div>
