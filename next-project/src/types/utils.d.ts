export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

export interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface ThrottleOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  total?: number;
}

export interface SortOptions {
  field: string;
  order: "asc" | "desc";
}

export interface FilterOptions {
  field: string;
  value: string | number | boolean;
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "lt" | "gte" | "lte";
} 