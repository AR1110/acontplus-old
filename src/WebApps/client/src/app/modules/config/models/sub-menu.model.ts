export  interface  SubMenuNode {
  id: number
  menuId: number
  code: string
  url: string
  icon: string
  name: string
  actions: any[] | null,
  enabled: boolean
}
