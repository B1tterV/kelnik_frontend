import { generateMockFlats } from '~/server/mocks/flatsGenerator'

// Глобальная переменная для хранения сгенерированных данных
let cachedFlats: ReturnType<typeof generateMockFlats> | null = null

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Генерируем моки только при первом вызове
  if (!cachedFlats) cachedFlats = generateMockFlats(90)

  let filteredFlats = [...cachedFlats]
  
  // Фильтрация по цене
  if (query.priceStart && query.priceEnd) {
    const priceStart = Number(query.priceStart)
    const priceEnd = Number(query.priceEnd)
    filteredFlats = filteredFlats.filter(flat => {
      return flat.price >= priceStart && flat.price <= priceEnd
    })
  }

  // Фильтрация по площади
  if (query.footageStart && query.footageEnd) {
    const footageStart = Number(query.footageStart)
    const footageEnd = Number(query.footageEnd)

    if (!isNaN(footageStart) && !isNaN(footageEnd)) {
      filteredFlats = filteredFlats.filter(flat => {
        const footage = parseFloat(flat.footage.replace(',', '.'))
        return footage >= footageStart && footage <= footageEnd
      })
    }
  }
  
  // Фильтрация по комнатам
  if (query['rooms[]']) {
    const rooms = Array.isArray(query['rooms[]']) 
      ? query['rooms[]'].map(Number) 
      : [Number(query['rooms[]'])]
    filteredFlats = filteredFlats.filter(flat => rooms.includes(flat.rooms))
  }
  
  // Сортировка
  if (query.sortValue && query.sortDirection) {
    filteredFlats.sort((a, b) => {
      let valA: number, valB: number
      
      switch (query.sortValue) {
        case 'price':
          valA = a.price
          valB = b.price
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
      
      return query.sortDirection === 'asc' ? valA - valB : valB - valA
    })
  }
  
  // Пагинация
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const start = (page - 1) * limit
  const end = start + limit
  const last_page = Math.ceil(filteredFlats.length / limit)
  
  return {
    status: 'success',
    data: {
      data: filteredFlats.slice(start, end),
      pagination: {
        total: filteredFlats.length,
        page,
        limit,
        last_page,
      }
    }
  }
})