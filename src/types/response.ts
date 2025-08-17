export type ResponseStatus = 'success' | 'error'

export interface ResponsePagination {
  total: number
  page: number
  limit: number
  last_page: number
}

export interface ResponseData<T = any> {
  status: Ref<ResponseStatus>
  data: {
    data: Ref<T>
    pagination: Ref<ResponsePagination>
  }
  error?: Ref<string | null>
  pending: Ref<boolean>
}