import { itemReadAdapter } from "@/core/adapters";
import { ItemService } from "@/core/services";
import { useEffect, useState } from "react";

const useFetchItems = () => {
    const [loading, setLoading] = useState(false)
    let controller: AbortController;


    const fetchItem = async (obj:object) => {
        let items: any = []
        try {
            setLoading(true);
            // Intentamos realizar una búsqueda de productos utilizando un servicio llamado 'productService'
            // pasando la cadena de búsqueda 'value' como parámetro.
            const dataFetch = ItemService.getAll(obj as any);

            // Si ya existe un controlador de solicitud activo (abortController), lo abortamos.
            if (controller) controller.abort();

            // Establecemos el nuevo controlador de solicitud para esta búsqueda.
            controller = dataFetch.controller;


            // Realizamos la llamada a la búsqueda utilizando 'dataFetch.call' y esperamos su resultado.
            const resultAxios = await dataFetch.call;

            // Extraemos los datos de la respuesta Axios.
            const response = resultAxios.data;
            items = itemReadAdapter(response.items || []);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
        return items;
    }

    useEffect(() => {
        return () => {
            controller && controller.abort();
        }
    }, [])

    return {
        loading,
        fetchItem
    }
}

export default useFetchItems;