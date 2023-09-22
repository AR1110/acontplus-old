import { promotionService } from "@/core/services";
import { useEffect, useState } from "react";
import PromotionCard from "./PromotionCard";
import { IPromotion } from "@/core/models";
import ItemListSkeleton from "../Item/ItemListSkeleton";
import { Grid } from "@mui/material";
import CustomNoRowsOverlay from "@/core/components/CustomNoRowsOverlay/CustomNoRowsOverlay";


const Promotion = () => {
    const [promotiones, setPromotiones] = useState<Array<IPromotion>>([]);
    const [loading, setLoading] = useState(false);
    let controller: AbortController;

    const search = async () => {
        try {
            setLoading(true);
            // Intentamos realizar una búsqueda de productos utilizando un servicio llamado 'productService'
            // pasando la cadena de búsqueda 'value' como parámetro.
            const dataFetch = promotionService.get({ pageIndex: 1, pageSize: 10, tipo: 2 });

            // Si ya existe un controlador de solicitud activo (abortController), lo abortamos.
            if (controller) controller.abort();

            // Establecemos el nuevo controlador de solicitud para esta búsqueda.
            controller = dataFetch.controller;


            // Realizamos la llamada a la búsqueda utilizando 'dataFetch.call' y esperamos su resultado.
            const resultAxios = await dataFetch.call;

            // Extraemos los datos de la respuesta Axios.
            const response = resultAxios.data;                       
            setPromotiones(response.promotions_pos)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        search();
        return () => {
            controller && controller.abort();
        }
    }, [])

    return (
        <>
            {
                loading && <ItemListSkeleton />
            }
            {
                !loading && promotiones.length === 0 && (
                    <Grid item container lg={12} justifyContent="center">
                        <CustomNoRowsOverlay />
                    </Grid>
                )
            }
            {
                promotiones.length > 0 && (
                    promotiones.map((promotion, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} >
                            <PromotionCard promotion={promotion} />
                        </Grid>
                    ))
                )
            }

        </>
    )
}

export default Promotion