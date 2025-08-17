<script setup lang="ts">
// Components
import BaseButton from '~/components/common/BaseButton.vue';
import BaseTable from '~/components/common/BaseTable.vue';

// Types
import type { Header, SortDirection } from '@/types/table'
import type { Flat } from '@/types/flat'

// Stores
import { useFlatsStore } from '@/stores/public/flats'

const flatsStore = useFlatsStore()

const loading = ref(false)
const currentPage = ref(1)

const headers = ref<Header[]>([
  { text: "Планировка", value: "layout", sortable: false, align: "left" },
  { text: "Квартира", value: "flat", sortable: false, align: "left" },
  { text: "S, м²", value: "footage", align: "left" },
  { text: "Этаж", value: "floor", align: "left" },
  { text: "Цена, ₽", value: "price", align: "left" },
])

const items = ref<Flat[]| []>([]);

const loadData = async () => {
  try {
    const response = await flatsStore.getFlats({
      page: 1,
      // price: { start: 5_500_000, end: 18_900_000 },
      // rooms: [1, 2, 3],
      // footage: { start: 33, end: 123 },
      // sortValue: 'price',
      // sortDirection: 'asc'
    })

    if (response.status.value === 'success') {
      items.value = response.data.data.value;
    } else {
      console.error('Ошибка:', response.error.value)
    }
  } catch (e) {
    console.error('Исключение:', e)
  }
}

await loadData()

const handleSort = ({ column, direction }: { column: string | null, direction: SortDirection }) => {
  console.log(`Сортировка по ${column} в направлении ${direction}`)
  // Здесь можно выполнить API запрос или другую логику сортировки
}
</script>

<template>
    <div class="main-page wrapper">
        <div class="main-page__content">
            <div class="title">Квартиры</div>
            <BaseTable
                :headers="headers"
                :items="items"
                :loading="loading"
                :page="currentPage"
                @sort="handleSort"
                >
                <template v-slot:layout="{ item }">
                    <img
                      :src="item.layout.img"
                      :alt="item.flat"
                      :width="item.width"
                      :height="item.height"
                    >
                </template>
            </BaseTable>
            <BaseButton is-border text="Загрузить еще" />
        </div>
        <div class="main-page__filters"></div>
    </div>
</template>

<style scoped lang="scss">
.main-page{
    padding-top: 96px;
    padding-bottom: 96px;

    .title{
        @include UI-54-55-700;
        margin-bottom: 48px;
    }

    .base-table{
      margin-bottom: 48px;
    }
}
</style>