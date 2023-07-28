import { CategoryState } from "@/modules/admin/models";
import { useEffect, useReducer } from "react";
import { CategoryReducer } from "./CategoryReducer";
import { CategorySvc } from "@/modules/admin/services";
import { CategoryContext } from "./CategoryContext";

const INITIAL_STATE: CategoryState = {
	subFamilia: [],
	dataFormApi: {
		subFamilias: [],
	}
}

interface Props {
	children: JSX.Element | JSX.Element[]
}

export const CategoryProvider = ({ children }: Props) => {
	const [categoryState, dispatch] = useReducer(CategoryReducer, INITIAL_STATE)

	const getCategory = () => {
		try {
			CategorySvc.getAll().then((response) => {
				const list = JSON.parse(response.payload);

				dispatch({ type: 'list', payload: list })
			});
		}catch(error){
			console.log(error);
		}
	};

	useEffect(() => {
		getCategory();
	}, []);

	return (
		<CategoryContext.Provider value={{ categoryState}}>
			{children}
		</CategoryContext.Provider>
	);
}