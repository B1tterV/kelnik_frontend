export interface Header {
    text: string
    value: string
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
    isBoldBody?: boolean
}

export type SortDirection = 'asc' | 'desc' | null