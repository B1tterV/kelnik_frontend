export interface Header {
    text: string
    value: string
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
}

export type SortDirection = 'asc' | 'desc' | null