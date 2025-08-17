// Modules
import { defineStore } from 'pinia'

// Mock
import { generateMockFlats } from '~/server/mocks/flatsGenerator'

// Types
import type { Flat, GetFlatsParams } from '@/types/flat'

export const useFlatsStore = defineStore('flats', () => {
  const flats = ref<Flat[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getFlats = async (params: GetFlatsParams = {}): Promise<{
    status: { value: 'success' | 'error' }
    data: { 
      data: { value: Flat[] }
      pagination: { 
        value: { 
          total: number
          page: number
          limit: number 
        } 
      } 
    }
    error: { value: string | null }
    pending: Ref<boolean>
  }> => {
    const page = params.page || 1
    const limit = params.limit || 20
    loading.value = true

    try {
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 500))

      // Генерация данных
      let allFlats = generateMockFlats(100)

      // Фильтрация по цене
      if (params.price) {
        allFlats = allFlats.filter(flat => {
          const price = parseInt(flat.price.replace(/\s/g, ''))
          return price >= params.price!.start && price <= params.price!.end
        })
      }

      // Фильтрация по комнатам
      if (params.rooms) {
        allFlats = allFlats.filter(flat => params.rooms!.includes(flat.rooms))
      }

      // Фильтрация по площади
      if (params.footage) {
        allFlats = allFlats.filter(flat => {
          const footage = parseFloat(flat.footage.replace(',', '.'))
          return footage >= params.footage!.start && footage <= params.footage!.end
        })
      }

      // Сортировка
      if (params.sortValue && params.sortDirection) {
        allFlats.sort((a, b) => {
          let valA: number, valB: number

          switch (params.sortValue) {
            case 'price':
              valA = parseInt(a.price.replace(/\s/g, ''))
              valB = parseInt(b.price.replace(/\s/g, ''))
              break
            case 'footage':
              valA = parseFloat(a.footage.replace(',', '.'))
              valB = parseFloat(b.footage.replace(',', '.'))
              break
            case 'floor':
              valA = parseInt(a.floor.split(' ')[0])
              valB = parseInt(b.floor.split(' ')[0])
              break
            default:
              return 0
          }

          return params.sortDirection === 'asc' ? valA - valB : valB - valA
        })
      }

      // Пагинация
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedFlats = allFlats.slice(start, end)

      flats.value = paginatedFlats

      return {
        status: { value: 'success' },
        data: {
          data: { value: paginatedFlats },
          pagination: {
            value: {
              total: allFlats.length,
              page,
              limit
            }
          }
        },
        error: { value: null },
        pending: loading
      }
    } catch (err) {
      error.value = 'Ошибка загрузки данных'
      return {
        status: { value: 'error' },
        data: {
          data: { value: [] },
          pagination: {
            value: {
              total: 0,
              page: 1,
              limit: 10
            }
          }
        },
        error: { value: error.value },
        pending: loading
      }
    } finally {
      loading.value = false
    }
  }

  return {
    flats,
    loading,
    error,
    getFlats
  }
})