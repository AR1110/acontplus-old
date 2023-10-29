import { bubble, listen } from "svelte/internal";
export function getEventsAction(component) {
  return node => {
    const events = Object.keys(component.$$.callbacks);
    const listeners = [];
    events.forEach(event =>
      listeners.push(listen(node, event, e => bubble(component, e)))
    );
    return {
      destroy: () => {
        listeners.forEach(listener => listener());
      }
    };
  };
}


export function getFirstDayOfMonth() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

export function getLastDayOfMonth() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
}

export function groupEstabAndCreatePtoEmisionNodes(estabs) {
  const groupedEstabs = estabs.reduce((acc, item) => {
    const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

    if (!existingItem) {
      acc.push({
        idEstablecimiento: item.idEstablecimiento,
        nombreComercial: item.nombreComercial,
        codEstab: item.codEstab,
        defaultEstab: item.defaultEstab,
        puntosEmision: [{
          idPuntoEmision: item.idPuntoEmision,
          ptoEmi: item.ptoEmi,
          defaultPtoEmi: item.defaultPtoEmi
        }]
      });
    } else {
      existingItem.puntosEmision.push({
        idPuntoEmision: item.idPuntoEmision,
        ptoEmi: item.ptoEmi,
        defaultPtoEmi: item.defaultPtoEmi
      });
    }
    return acc;
  }, []);

  return groupedEstabs;
}

