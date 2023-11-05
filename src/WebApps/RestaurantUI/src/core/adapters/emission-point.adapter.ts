import { EmissionPointAsign } from "../models";

function emissionPointAdapter(emissionPoints: EmissionPointAsign[]): Array<EmissionPointAsign> {
    return emissionPoints.map(emissionPoint => ({
        idPuntoEmision: emissionPoint.idPuntoEmision,
        ptoEmi: emissionPoint.ptoEmi,
        idPtoEmi_asig: emissionPoint.idPtoEmi_asig,
        codEstab_Asig: emissionPoint.codEstab_Asig,
        predeterminado: emissionPoint.predeterminado,
    }))
}

export {
    emissionPointAdapter
}