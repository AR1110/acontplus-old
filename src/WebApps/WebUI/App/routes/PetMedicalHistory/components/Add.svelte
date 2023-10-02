<script>
  import { onMount } from "svelte";
  import { client } from "$core/api/axiosClient";
  import AdvancedSearch from "$core/components/AdvancedSearch.svelte";
  import toast from "$core/utils/toast";
  import { showLoader, hideLoader } from "$core/utils/loading-spinner";

  export let newRecord;
  export let editStatus;
  export let historyEdited;
  export let initialLoad;
  export let codEstab;

  let diseases = [],
    diseasesStatuses = [],
    behaviors = [],
    behaviorsStatuses = [];

  let healthChecks = [];

  let medicalHistory = {
    codEstab: "",
    petId: "",
    date: "",
    healthChecks: [],
    behaviorTests: [],
    observations: "",
    age: 0,
    weight: 0,
  };

  let petSelected = {
    customer: "",
    customerIdCard: "",
    id: "",
    name: "",
    email: "",
    petType: "",
    age: "",
    color: "",
    breed: "",
    gender: "",
  };

  const formatDate = (date = null) => {
    let now = new Date();
    if (date) {
      now = new Date(date);
    }
    let month, day, year;

    //let dateString;
    (month = "" + (now.getMonth() + 1)),
      (day = "" + now.getDate()),
      (year = now.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  onMount(async () => {
    console.log("starting");
    await client.get("Vet/Diseases/").then((response) => {
      diseases = response.data;
    });
    await client.get("Vet/DiseaseStatus/").then((response) => {
      diseasesStatuses = response.data;
    });
    await client.get("Vet/Behaviors/").then((response) => {
      behaviors = response.data;
    });
    await client.get("Vet/BehaviorStatus/").then((response) => {
      behaviorsStatuses = response.data;
    });

    if (!editStatus) {
      medicalHistory.date = formatDate();
    }
    if (editStatus) {
      await client
        .get("Vet/MedicalHistories/" + historyEdited.id)
        .then((response) => {
          let tempArray = JSON.parse(response.data.payload);
          let objData = tempArray["medicalHistory"][0];
          petSelected.customer = objData.businessName;
          petSelected.customerIdCard = objData.idCard;
          petSelected.id = objData.petId;
          petSelected.name = objData.name;
          petSelected.email = objData.email;
          petSelected.petType = objData.pettype;
          petSelected.age = objData.age;
          petSelected.color = objData.color;
          petSelected.breed = objData.breed;
          petSelected.gender = objData.gender;
          medicalHistory.id = objData.id;

          // let editedDate = new Date(objData.date);
          // console.log(editedDate);
          // (month = "" + (editedDate.getMonth() + 1)),
          // 	(day = "" + editedDate.getDate()),
          // 	(year = editedDate.getFullYear());

          // if (month.length < 2) month = "0" + month;
          // if (day.length < 2) day = "0" + day;

          // dateString = [year, month, day].join("-");

          medicalHistory.date = formatDate(objData.date);
          medicalHistory.observations = objData.observations;
          medicalHistory.age = objData.age;
          medicalHistory.weight = objData.weight;

          healthChecks = tempArray["healthChecks"];
          tempArray["healthChecks"].forEach((value, key) => {
            addDiseaseStatus(value.diseaseId, value.diseaseStatusId, false);
            document.getElementById(
              `${value.diseaseId}-${value.diseaseStatusId}-chkdds`
            ).checked = true;
          });

          behaviorTests = tempArray["behaviors"];
          tempArray["behaviors"].forEach((value, key) => {
            addBehaviorStatus(value.behaviorId, value.behaviorStatusId);
            document.getElementById(
              `${value.behaviorId}-${value.behaviorStatusId}-chkbbs`
            ).checked = true;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  function addDisease(d, ds) {
    healthChecks.push({
      medicalHistoryId: editStatus ? medicalHistory.id : 0,
      diseaseId: d,
      diseaseStatusId: ds,
    });
  }
  const updateHealthCheck = async (d, ds) => {
    let id = healthChecks.find(
      (check) => check.diseaseId === d && check.diseaseStatusId === ds
    ).id;
    let checkUpdated = {
      id: id,
      medicalHistoryId: medicalHistory.id,
      diseaseId: d,
      diseaseStatusId: ds,
    };
    await client
      .put("Vet/HealthChecks/" + id, checkUpdated)
      .then((response) => {
        toast({
          type: "success",
          message: "Actualizada exitosamente",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function addDiseaseStatus(d, ds, dbUp) {
    if (healthChecks.some((check) => check.diseaseId === d)) {
      healthChecks.find((check) => check.diseaseId === d).diseaseStatusId = ds;
      if (editStatus && dbUp) {
        updateHealthCheck(d, ds);
      }
    } else {
      addDisease(d, ds);
    }
  }

  let behaviorTests = [];
  function addBehavior(d, ds) {
    behaviorTests.push({
      medicalHistoryId: editStatus ? medicalHistory.id : 0,
      behaviorId: d,
      behaviorStatusId: ds,
    });
  }

  const updateBehaviorTest = async (b, bs) => {
    let id = behaviorTests.find(
      (behavior) =>
        behavior.behaviorId === b && behavior.behaviorStatusId === bs
    ).id;
    let testUpdated = {
      id: id,
      medicalHistoryId: medicalHistory.id,
      behaviorId: b,
      behaviorStatusId: bs,
    };
    await client
      .put("Vet/BehaviorTests/" + id, testUpdated)
      .then((response) => {
        toast({
          type: "success",
          message: "Actualizado exitosamente",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function addBehaviorStatus(b, bs, dbUp) {
    if (behaviorTests.some((test) => test.behaviorId === b)) {
      behaviorTests.find((test) => test.behaviorId === b).behaviorStatusId = bs;

      if (editStatus && dbUp) {
        updateBehaviorTest(b, bs);
      }
    } else {
      addBehavior(b, bs);
    }
  }

  let value = "";
  let isFocused = false;
  //const onInput = (e) => (value = e.target.value)
  let pets = [];
  const onInput = async (e) => {
    value = e.target.value;
    console.log(value);
    if (value.length >= 3) {
      showLoader();
      let data = {
        tipo: 2,
        textSearch: value,
      };
      await client
        .get(`Vet/pets/search?json=` + JSON.stringify(data))
        .then((response) => {
          hideLoader();
          if (response.data.code == 1) {
            pets = JSON.parse(response.data.payload);
            console.log(pets);
          }
        })
        .catch((error) => {
          hideLoader();
          console.log(error);
        });
    } else if (pets.length > 0) {
      pets = [];
    }
  };
  const onFocus = () => (isFocused = true);
  const onBlur = () => {
    if (!value) {
      pets = [];
      value = "";
    }
  };
  let placeholder = "Buscar cliente/mascota";
  let isPetSelected = false;
  const selectPet = (e) => {
    isPetSelected = true;
    petSelected = e;
    value = "";
    pets = [];
  };

  const addHistory = async () => {
    if (!codEstab) {
      toast({
        type: "warning",
        message: "Debe seleccionar un establecimiento",
      });
      return;
    }
    if (!petSelected.id) {
      toast({ type: "warning", message: "Debe asignar un cliente" });
      return;
    }
    if (healthChecks.length == 0) {
      toast({
        type: "warning",
        message: "Debe registrar el test de salud",
      });
      return;
    }
    debugger;
    if (behaviorTests.length == 0) {
      toast({
        type: "warning",
        message: "Debe de registrar los test de comportamiento",
      });
      return;
    }
    const newHistory = {
      codEstab: codEstab,
      petId: petSelected.id,
      date: medicalHistory.date,
      healthChecks: healthChecks,
      behaviorTests: behaviorTests,
      observations: medicalHistory.observations,
      age: medicalHistory.age,
      weight: medicalHistory.weight,
    };
    await client
      .post("Vet/MedicalHistories/", newHistory)
      .then((response) => {
        toast({
          type: "success",
          message: "Registrado exitosamente",
        });
        newRecord = false;
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
    medicalHistory = {};
  };

  const updateHistory = async () => {
    if (!medicalHistory.id) {
      toast({
        type: "warning",
        message: "No se encontro el recurso para editar",
      });
      return;
    }
    if (healthChecks.length == 0) {
      toast({
        type: "warning",
        message: "Debe registrar el test de salud",
      });
      return;
    }
    if (behaviorTests.length == 0) {
      toast({
        type: "warning",
        message: "Debe de registrar los test de comportamiento",
      });
      return;
    }
    const updatedHistory = {
      id: medicalHistory.id,
      petId: petSelected.id,
      codEstab: codEstab,
      date: medicalHistory.date,
      healthChecks: healthChecks,
      behaviorTests: behaviorTests,
      observations: medicalHistory.observations,
      age: medicalHistory.age,
      weight: medicalHistory.weight,
    };
    await client
      .put("Vet/MedicalHistories/" + medicalHistory.id, updatedHistory)
      .then((response) => {
        toast({
          type: "success",
          message: "Actualizada exitosamente",
        });
        newRecord = false;
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
    medicalHistory = {};
    editStatus = false;
    initialLoad();
  };

  const onSubmitHandler = () => {
    if (editStatus) {
      updateHistory();
    } else {
      addHistory();
    }
  };
</script>

<div class="card">
  <div class="card-body">
    <div class="row">
      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
        <div class="form-group">
          <div class="input-group">
            <AdvancedSearch
              on:input={onInput}
              on:focus={onFocus}
              on:blur={onBlur}
              {value}
              {placeholder}
            />
          </div>
          {#if pets.length > 0 && !isPetSelected}
            <div class="floating-results list-group">
              {#each pets as item}
                <a
                  href={null}
                  class="list-group-item"
                  style="cursor:pointer"
                  title="Seleccionar"
                  on:click={selectPet(item)}
                  ><i class="fa fa-paw" /> ({item.name}) -
                  <i class="ti-user" />
                  {item.customer}</a
                >
              {/each}
            </div>{/if}
        </div>
      </div>
    </div>
    {#if (petSelected.id > 0) | editStatus}
      <form on:submit|preventDefault={onSubmitHandler}>
        <div class="row">
          <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <label for="">Fecha</label>
            <input
              type="date"
              name=""
              id=""
              class="form-control"
              bind:value={medicalHistory.date}
            />
          </div>
        </div>
        <br />
        <div class="card border border-info rounded">
          <div class="card-body">
            <h5 class="card-title">Datos del Responsable</h5>
            <div class="row">
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div class="form-group">
                  <label for="">Cliente</label>
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    value={petSelected.customer}
                  />
                </div>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                <div class="form-group">
                  <label for="">Ruc</label>
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    value={petSelected.customerIdCard}
                  />
                </div>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                <div class="form-group">
                  <label for="">Email</label>
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    value={petSelected.email}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card border border-info rounded">
          <div class="card-body">
            <h5 class="card-title">Datos de la mascota</h5>
            <div class="row">
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
                <div class="form-group">
                  <label for="pet-name">Nombre</label>
                  <h5>{petSelected.name}</h5>
                </div>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                <div class="form-group">
                  <label for="pet-type">Tipo</label>
                  <h5>{petSelected.petType}</h5>
                </div>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                <div class="form-group">
                  <label for="pet-age">Raza</label>
                  <h5>{petSelected.breed}</h5>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                <div class="form-group">
                  <label for="pet-age">Sexo</label>
                  <h5>{petSelected.gender}</h5>
                </div>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                <div class="form-group">
                  <label for="pet-age">Color</label>
                  <h5>{petSelected.color}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Test de Salud</th>
              {#each diseasesStatuses as item}
                <th>{item.name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each diseases as d}
              <tr>
                <td>{d.name}</td>
                {#each diseasesStatuses as ds}
                  <td
                    ><input
                      type="radio"
                      id="{d.id}-{ds.id}-chkdds"
                      name="{d.id}-chkdds"
                      on:change={() => addDiseaseStatus(d.id, ds.id, true)}
                    /></td
                  >
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Test de Comportamiento:</th>
              {#each behaviorsStatuses as item}
                <th>{item.name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each behaviors as b}
              <tr>
                <td>{b.name}</td>
                {#each behaviorsStatuses as bs}
                  <td
                    ><input
                      type="radio"
                      id="{b.id}-{bs.id}-chkbbs"
                      name="{b.id}-chkbbs"
                      on:change={() => addBehaviorStatus(b.id, bs.id, true)}
                    /></td
                  >
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>

        <div class="row">
          <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div class="form-group">
              <label for="">Corte y Estilo</label>
              <textarea
                name=""
                id=""
                class="form-control"
                bind:value={medicalHistory.observations}
              />
            </div>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
            <div class="form-group">
              <label for="age">Edad</label>
              <input
                type="number"
                id="age"
                class="form-control"
                step="any"
                bind:value={medicalHistory.age}
              />
            </div>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
            <div class="form-group">
              <label for="weight">Peso (kg)</label>
              <input
                type="number"
                id="weight"
                class="form-control"
                placeholder="5.5"
                step="any"
                bind:value={medicalHistory.weight}
              />
            </div>
          </div>
        </div>
        <br />
        <button type="submit" class="btn btn-success">
          <i class="ti-save" />
          Guardar
        </button>
      </form>
    {/if}
  </div>
</div>
