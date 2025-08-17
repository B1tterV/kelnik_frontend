import { defineStore } from 'pinia'
import type { GetFlatsParams, FlatsResponse } from '@/types/flat'

export const useFlatsStore = defineStore('flats', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getFlats = async (params: GetFlatsParams = {}): Promise<FlatsResponse> => {
    loading.value = true
    
    try {
      const response = await $fetch('/api/flats', {
        query: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.price && {
            priceStart: params.price.start,
            priceEnd: params.price.end
          }),
          ...(params.footage && {
            footageStart: params.footage.start,
            footageEnd: params.footage.end
          }),
          ...(params.rooms && params.rooms.length > 0 && { 
            'rooms[]': params.rooms 
          }),
          ...(params.sortValue && { sortValue: params.sortValue }),
          ...(params.sortDirection && { sortDirection: params.sortDirection })
        }
      })
      
      return {
        status: ref('success'),
        data: {
          data: ref(response.data.data),
          pagination: ref(response.data.pagination)
        },
        error: ref(null),
        pending: loading
      }
    } catch (err) {
      error.value = 'Ошибка загрузки данных'
      return {
        status: ref('error'),
        data: {
          data: ref([]),
          pagination: ref({
            total: 0,
            page: 1,
            limit: 10,
            last_page: 1
          })
        },
        error: ref(error.value),
        pending: loading
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getFlats
  }
})