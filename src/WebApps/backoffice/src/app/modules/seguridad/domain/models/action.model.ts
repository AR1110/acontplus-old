export interface ActionModel {
  id: number;
  code: string;
  name: string;
  position?: number;
  selected?: boolean;
  description?: string;
}
export interface ActionList     {
   code : string
  name : string
   description : string
   id : number
  isActive : boolean
   deleted : boolean
}

export interface ActionSubMenu extends   ActionModel {
  actionId: number
  completed?: boolean
}
export interface MainNodeAction  {
  name: string;
  completed: boolean;
  actions?: ActionSubMenu[];
}


export interface ActionResponse {
  data: ActionList[]
  totalRecords: number
}
