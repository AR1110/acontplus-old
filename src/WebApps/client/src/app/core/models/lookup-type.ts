export interface LookupType {
  module: string; // 'sales', 'billing', 'config'
  context: string; // 'filters', 'dialog', 'form'
}

export interface LookupItem {
  id: number;
  code: string;
  value: string;
  displayOrder: number;
  parentId?: number;
  isActive: boolean;
  isDefault: boolean;
  metadata?: Record<string, any>;
}

export enum ModuleType {
  Products = 'Products',
  Customers = 'Customers',
}

export enum ContextType {
  Filter = 'Filter',
  Dialog = 'Dialog',
}
