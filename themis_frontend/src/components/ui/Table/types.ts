import type { DataTableProps as OriginalDataTableProps } from "./types";

// Tipos genéricos para DataTable
export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isDarkMode?: boolean;
  pageSize?: number;
  filterPlaceholder?: string;
  filterFunction?: (row: T, filter: string) => boolean;
  className?: string;
  onRowClick?: (row: T) => void;
}