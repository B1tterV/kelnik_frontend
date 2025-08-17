import type { SortDirection } from '@/types/table'

interface Layout {
  img: string;
  width?: number;
  height?: number;
}

export interface Flat {
  id: string;
  layout: Layout;
  flat: string;
  footage: string;
  floor: string;
  price: string;
  rooms: number;
}

type SortValue = 'price' | 'footage' | 'floor'

interface FilterFromTo {
    start: number;
    end: number;
}

export interface GetFlatsParams {
  page?: number
  limit?: number
  price?: FilterFromTo
  rooms?: number[]
  footage?: FilterFromTo
  sortValue?: SortValue
  sortDirection?: SortDirection
}