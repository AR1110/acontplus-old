export const articuloMapper = {


    fromApiFilter(response){

    },

    fromApiList(articulos){
        return articulos.map(item => {
            return {
                idArticulo: item.idArticulo,
                idMedida: item.idMedida,
                code_unique: item.code_unique,
                codigo: item.codigo,
                descripcion: item.descripcion,
                precioCosto: item.precioCosto,
                estado: item.estado,
                stock: item.stock,
                observaciones: item.observaciones,
                imagen: item.imagen,
                subFamilia: item.subFamilia,
                medida: item.medida,
                tipoIva: item.tipoIva,
                tipoArticulo: item.tipoArticulo,
                totalRecords: item.totalRecords,
                style: item.style,
                s3ObjectKey: item.s3ObjectKey,
                s3ObjectUrl: item.s3ObjectUrl
            }
        })
    }

}