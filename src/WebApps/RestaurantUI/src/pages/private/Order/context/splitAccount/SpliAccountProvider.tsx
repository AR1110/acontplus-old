import { useReducer } from "react"
import { SplitAccountState } from "../../models"
import { SplitAccountContext } from "./SplitAccountContext" 
import { useAsync, useFetchAndLoad } from "@/hooks"
import { OrdenService } from "@/core/services"
import { orderReadForUpdateAdapter } from "@/core/adapters"
import { splitAccountReducer } from "."

const INITIAL_STATE: SplitAccountState = {
    orderLoading: false,
    leftOrderItems: [],
    rightOrderItems: [],
}

interface Props {
    children: JSX.Element | JSX.Element[]
}
export const SpliAccountProvider = ({children}: Props)=>{
    const [splitAccountState, dispatch] = useReducer(splitAccountReducer, INITIAL_STATE);
    // const { loading, callEndpoint } = useFetchAndLoad();
    // const getItemsApi = async () => await callEndpoint(OrdenService.getId(3));

    // const itemAdapter = async (response: any) => { 
                
    //     const data = await orderReadForUpdateAdapter(response);
    //     console.log(data)
    //     // setCollectionItems([])
    //     // const items = itemReadAdapter(response.items || []);
        
    //     // setCollectionItems(items)
    // }
 

    // //se ejecuta cada vez que cambian la categoria
    // useAsync(getItemsApi, itemAdapter, () => {
    //     console.log('init')
    // }, []);

    return (
        <SplitAccountContext.Provider value={{
            splitAccountState
        }}>
            {children}
        </SplitAccountContext.Provider>
    )
}