// Todo: Customer select to SupportDetail tabl

class CustomSelect  {
  // Todo: Seleccionamos las bodegas
  selectWareHouses = (cell, onRendered, success, cancel) => {
    let warehouses = [];
    const rows = cell.getRow().getData();

    if (rows.tarifas != undefined || rows.tarifas != null) {
      warehouses = rows.bodegas;
    }

    const selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.bodega = selectList.selectedOptions[0].text;
        cell.getElement().dataset.idBodega =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener("blur", onChange);

    for (let i = 0; i < warehouses.length; i++) {
      const option = document.createElement("option");

      option.value = warehouses[i].idBodega.toString();
      option.text = warehouses[i].bodega;
      if (warehouses[i].idBodega === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };

  // Todo: Seleccionamos las tarifas
  selectFee = (cell, onRendered, success, cancel) => {
    let fees = [];
    const rows = cell.getRow().getData();

    if (rows.tarifas != undefined || rows.tarifas != null) {
      fees = rows.tarifas;
    }

    const selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.tarifa = selectList.selectedOptions[0].text;
        cell.getElement().dataset.idTarifa =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener("blur", onChange);

    for (let i = 0; i < fees.length; i++) {
      const option = document.createElement("option");

      option.value = fees[i].idTarifa.toString();
      option.text = fees[i].tarifa;
      if (fees[i].idTarifa === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };

  // Todo: Seleccionamos las medidas
  selectMeasures = (cell, onRendered, success, cancel) => {
    let measures = [];
    const rows = cell.getRow().getData();

    if (rows.medidas != undefined || rows.medidas != null) {
      measures = rows.medidas;
    }

    const selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.descripcion =
          selectList.selectedOptions[0].text;
        cell.getElement().dataset.idMedida =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener("blur", onChange);

    for (let i = 0; i < measures.length; i++) {
      const option = document.createElement("option");

      option.value = measures[i].idMedida.toString();
      option.text = measures[i].descripcion;
      if (measures[i].idMedida === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };

  // Todo: Seleccionamos el tipo de iva
  selectTipoIva = (cell, onRendered, success, cancel) => {
    let tipoIvas = [];
    const rows = cell.getRow().getData();

    if (rows.tipoIvas != undefined || rows.tipoIvas != null) {
      tipoIvas = rows.tipoIvas;
    }

    const selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.descripcion =
          selectList.selectedOptions[0].text;
        cell.getElement().dataset.idTipoIva = selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener("blur", onChange);

    for (let i = 0; i < tipoIvas.length; i++) {
      const option = document.createElement("option");

      option.value = tipoIvas[i].idTipoIva.toString();
      option.text = tipoIvas[i].descripcion;
      if (tipoIvas[i].idTipoIva === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };
}

export const customSelect = new CustomSelect();
