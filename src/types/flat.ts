import type { SortDirection } from '@/types/table'
import type { ResponseData } from '@/types/response'

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
  price: number;
  rooms: number;
}

export type SortValue = 'price' | 'footage' | 'floor' | null

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

export type FlatsResponse = ResponseData<Flat[]>