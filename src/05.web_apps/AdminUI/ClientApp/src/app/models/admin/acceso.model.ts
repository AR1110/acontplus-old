export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
}

export class TodoItemFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
}
