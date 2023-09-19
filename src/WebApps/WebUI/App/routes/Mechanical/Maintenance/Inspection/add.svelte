<script lang="ts">
  import { InspectionStore } from "$routes/Mechanical/Store/inspection.store";
  import Modal from "$core/components/Modal.svelte";
  import toast from "$core/utils/toast";

  let support;
  let inspection;
  let vehicleParts;
  let engines;
  let transmissionSystem;
  let brakeSystem;
  let data;
  let steeringSystem;
  let suspensionSystem;

  InspectionStore.subscribe((values) => {
    inspection = values.inspection;
    support = values.support;
    vehicleParts = values.vehicleParts;
    // Motor
    engines = vehicleParts.filter((item) => item.codeTypePart === "MT");
    // Sistema de Transmisión
    transmissionSystem = vehicleParts.filter(
      (item) => item.codeTypePart === "ST"
    );
    // Sistema de Frenos
    brakeSystem = vehicleParts.filter((item) => item.codeTypePart === "SF");
    // Sistema de Dirección
    steeringSystem = vehicleParts.filter((item) => item.codeTypePart === "SD");
    // Sistema de Suspensión
    suspensionSystem = vehicleParts.filter(
      (item) => item.codeTypePart === "SS"
    );
  });

  const onSave = () => {
    data = {
      engine: engines.map((item) => ({
        part: item.part,
        status: item.status,
        obs: item.obs,
      })),

      transmission: transmissionSystem.map((item) => ({
        part: item.part,
        status: item.status,
        obs: item.obs,
      })),

      brake: brakeSystem.map((item) => ({
        part: item.part,
        status: item.status,
        obs: item.obs,
      })),

      steering: steeringSystem.map((item) => ({
        part: item.part,
        status: item.status,
        obs: item.obs,
      })),

      suspension: suspensionSystem.map((item) => ({
        part: item.part,
        status: item.status,
        obs: item.obs,
      })),
    };

    if (!onValidate()) return;

    inspection.engine = data.engine;
    inspection.transmission = data.transmission;
    inspection.brake = data.brake;
    inspection.steering = data.steering;
    inspection.suspension = data.suspension;
    inspection.supportId = support.supportId;
    console.log(inspection);
  };

  const onValidate = () => {
    let isValid = true;
    let valid = false;
    try {
      for (let index in data) {
        const arr = data[index];
        if (
          arr.some(
            (tempItem) => tempItem.status == true || tempItem.status == false
          )
        ) {
          valid = true;
        }
      }

      if (!valid) {
        toast({
          type: "warning",
          message: "Seleccione al menos un tipo de inspección",
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
    }));
  };
</script>

{#if $InspectionStore.isOpen}
  <Modal
    open={$InspectionStore.isOpen}
    iconTitle={"ti-plus"}
    title={"Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form
        style="text-transform:uppercase"
        on:submit|preventDefault={onSave}
        autocomplete="off"
      >
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="country">Serie Documento </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.sequence}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country">Marca </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.brand}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country">Tipo </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.vehicleType}
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="country">Modelo </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.model}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country">Color </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.color}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country">Motor </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.engine}
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="country">fecha </label>
              <input
                type="date"
                class="form-control"
                bind:value={inspection.date}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country">Kilometraje </label>
              <input
                type="text"
                class="form-control"
                bind:value={inspection.mileage}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country">Nivel de Combustible </label>
              <input
                type="text"
                class="form-control"
                bind:value={inspection.fuelLevel}
              />
            </div>
          </div>
        </div>

        <div id="accordion">
          <div class="card">
            <div class="card-header" id="heading1">
              <h5 class="mb-0">
                <button
                  class="btn btn-info"
                  data-toggle="collapse"
                  data-target="#collapse1"
                  aria-expanded="false"
                  aria-controls="collapse1"
                  type="button"
                >
                  MOTOR
                </button>
              </h5>
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
                    <thead>
                      <tr>
                        <th>item</th>
                        <th class="text-center">Bueno</th>
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
                                value={true}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox1{item.id}"
                              />
                            </div>
                          </td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox2{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={false}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox2{item.id}"
                              />
                            </div>
                          </td>
                          <td width="50%" class="text-center"
                            ><div class="col-12 col-sm-12 col-md-12 col-lg-12">
                              <input
                                type="text"
                                class="form-control"
                                bind:value={item.obs}
                              />
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

          <div class="card">
            <div class="card-header" id="heading2">
              <h5 class="mb-0">
                <button
                  class="btn btn-info"
                  data-toggle="collapse"
                  data-target="#collapse2"
                  aria-expanded="false"
                  aria-controls="collapse2"
                  type="button"
                >
                  SISTEMA DE TRANSMISIÓN
                </button>
              </h5>
            </div>

            <div
              id="collapse2"
              class="collapse"
              aria-labelledby="heading"
              data-parent="#accordion"
            >
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>item</th>
                        <th class="text-center">Bueno</th>
                        <th class="text-center">Malo</th>
                        <th class="text-center">Observación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each transmissionSystem as item}
                        <tr>
                          <td width="35%">{item.part}</td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox1{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={true}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox1{item.id}"
                              />
                            </div>
                          </td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox2{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={false}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox2{item.id}"
                              />
                            </div>
                          </td>
                          <td width="50%" class="text-center"
                            ><div class="col-12 col-sm-12 col-md-12 col-lg-12">
                              <input
                                type="text"
                                class="form-control"
                                bind:value={item.obs}
                              />
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

          <div class="card">
            <div class="card-header" id="heading3">
              <h5 class="mb-0">
                <button
                  class="btn btn-info"
                  data-toggle="collapse"
                  data-target="#collapse3"
                  aria-expanded="false"
                  aria-controls="collapse3"
                  type="button"
                >
                  SISTEMA DE FRENOS
                </button>
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
                    <thead>
                      <tr>
                        <th>item</th>
                        <th class="text-center">Bueno</th>
                        <th class="text-center">Malo</th>
                        <th class="text-center">Observación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each brakeSystem as item}
                        <tr>
                          <td width="35%">{item.part}</td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox1{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={true}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox1{item.id}"
                              />
                            </div>
                          </td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox2{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={false}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox2{item.id}"
                              />
                            </div>
                          </td>
                          <td width="50%" class="text-center"
                            ><div class="col-12 col-sm-12 col-md-12 col-lg-12">
                              <input
                                type="text"
                                class="form-control"
                                bind:value={item.obs}
                              />
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

          <div class="card">
            <div class="card-header" id="heading4">
              <h5 class="mb-0">
                <button
                  class="btn btn-info"
                  data-toggle="collapse"
                  data-target="#collapse4"
                  aria-expanded="false"
                  aria-controls="collapse4"
                  type="button"
                >
                  SISTEMA DE DIRECCIÓN
                </button>
              </h5>
            </div>

            <div
              id="collapse4"
              class="collapse"
              aria-labelledby="heading4"
              data-parent="#accordion"
            >
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>item</th>
                        <th class="text-center">Bueno</th>
                        <th class="text-center">Malo</th>
                        <th class="text-center">Observación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each steeringSystem as item}
                        <tr>
                          <td width="35%">{item.part}</td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox1{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={true}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox1{item.id}"
                              />
                            </div>
                          </td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox2{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={false}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox2{item.id}"
                              />
                            </div>
                          </td>
                          <td width="50%" class="text-center"
                            ><div class="col-12 col-sm-12 col-md-12 col-lg-12">
                              <input
                                type="text"
                                class="form-control"
                                bind:value={item.obs}
                              />
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

          <div class="card">
            <div class="card-header" id="heading5">
              <h5 class="mb-0">
                <button
                  class="btn btn-info"
                  data-toggle="collapse"
                  data-target="#collapse5"
                  aria-expanded="false"
                  aria-controls="collapse5"
                  type="button"
                >
                  SISTEMA DE SUSPENSIÓN
                </button>
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
                    <thead>
                      <tr>
                        <th>item</th>
                        <th class="text-center">Bueno</th>
                        <th class="text-center">Malo</th>
                        <th class="text-center">Observación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each suspensionSystem as item}
                        <tr>
                          <td width="35%">{item.part}</td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox1{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={true}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox1{item.id}"
                              />
                            </div>
                          </td>
                          <td width="5%" class="text-center"
                            ><div class="checkbox icheck-primary">
                              <input
                                class="form-check-input"
                                type="radio"
                                id="inlineCheckbox2{item.id}"
                                name="inlineCheckbox{item.id}"
                                value={false}
                                bind:group={item.status}
                              />
                              <label
                                class="form-check-label"
                                for="inlineCheckbox2{item.id}"
                              />
                            </div>
                          </td>
                          <td width="50%" class="text-center"
                            ><div class="col-12 col-sm-12 col-md-12 col-lg-12">
                              <input
                                type="text"
                                class="form-control"
                                bind:value={item.obs}
                              />
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
    </div>
  </Modal>
{/if}
