type CityCode = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "17" | "22"
export interface RawCityData {
    idCiudad: number,
    provincia: string
    descripcion: string
    codigo: CityCode
}

export interface City {
    cityId: number,
    province: string
    description: string
    code: CityCode
}