import { ColumnDefinition } from './column-definition.model';

export interface OptionSearchConfig<T> {
  visibleColumns?: string[];
  columnDefinitions?: ColumnDefinition[];
  close?: boolean;
}
