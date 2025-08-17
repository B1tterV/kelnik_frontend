<script setup lang="ts">
import debounce from "lodash.debounce";

// Icons
import ArrowUpIcon from '@/assets/icons/arrow-up.svg'

// Components
import BaseButton from '~/components/common/BaseButton.vue';
import BaseTable from '~/components/common/BaseTable.vue';
import FlatsFilter from '~/components/flats/FlatsFilter.vue';

// Types
import type { Header, SortDirection } from '@/types/table'
import type { Flat, SortValue } from '@/types/flat'
import type { ResponsePagination } from '@/types/response'

// Stores
import { useFlatsStore } from '@/stores/public/flats'

// Utils
import formatedNumber from '@/utils/formatedNumber'

const flatsStore = useFlatsStore()

const loading = ref(false)
const currentPage = ref(1)
const sortValue = ref<SortValue>(null)
const sortDirection = ref<SortDirection>(null)
const pagination = ref<ResponsePagination | null>(null)

const priceRange = ref({ from: 1_000_000, to: 100_000_000 })
const squareRange = ref({ from: 5, to: 300 })
const activeRooms = ref<number[] | []>([])

const headers = ref<Header[]>([
  { text: "Планировка", value: "layout", sortable: false, align: "left" },
  { text: "Квартира", value: "flat", sortable: false, align: "left" },
  { text: "S, м²", value: "footage", align: "left" },
  { text: "Этаж", value: "floor", align: "left" },
  { text: "Цена, ₽", value: "price", align: "left" },
])

const items = ref<Flat[]| []>([]);

const loadData = async () => {
  loading.value = true
  try {
    const response = await flatsStore.getFlats({
      page: currentPage.value,
      sortValue: sortValue.value,
      sortDirection: sortDirection.value,
      ...((priceRange.value.from !== 1_000_000 || priceRange.value.to !== 100_000_000) ? { 
        price: { 
          start: priceRange.value.from, 
          end: priceRange.value.to 
        } 
      } : {}),
      ...((squareRange.value.from !== 5 || squareRange.value.to !== 300) ? { 
        footage: {
          start: squareRange.value.from, 
          end: squareRange.value.to 
        }
      } : {}),
      ...(activeRooms.value.length > 0 && { 
        rooms: activeRooms.value 
      }),
    })

    if (response.status.value === 'success') {
      const data: Flat[] = response.data.data.value;
      items.value = currentPage.value === 1 ? [...data] : [...items.value, ...data]
      pagination.value = response.data.pagination.value
    } else {
      console.error('Ошибка:', response.error?.value)
    }
  } catch (e) {
    console.error('Исключение:', e)
  } finally {
    loading.value = false
  }
}

const debouncedLoadData = debounce(() => {
  currentPage.value = 1
  loadData()
}, 300)

const handleSort = async ({ column, direction }: { column: string, direction: SortDirection }) => {
  sortValue.value = column as SortValue;
  sortDirection.value = direction;
  currentPage.value = 1
  await loadData();
}

const loadMore = async () => {
  currentPage.value += 1
  await loadData()
}

const scrollTop = () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
}

onMounted(async () => {
  await loadData()
});

watch(
  [priceRange, squareRange, activeRooms],
  () => {
    debouncedLoadData()
  },
  { deep: true } // Важно для объектов и массивов!
)
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
                <template v-slot:price="{ item }">
                    {{ formatedNumber(item.price) }}
                </template>
            </BaseTable>
            <BaseButton
              v-if="pagination && pagination.last_page > currentPage"
              is-border
              text="Загрузить еще"
              :disabled="loading"
              @click="loadMore()"
            />
        </div>
        <div class="main-page__filters">
          <FlatsFilter
            v-model:priceRange="priceRange"
            v-model:squareRange="squareRange"
            v-model:activeRooms="activeRooms"
          />
        </div>
        <div class="main-page__go-top" @click="scrollTop()">
          <ArrowUpIcon filled />
        </div>
    </div>
</template>

<style scoped lang="scss">
.main-page{
    position: relative;
    display: flex;
    gap: 80px;
    padding-top: 96px;
    padding-bottom: 96px;

    &__content {
      flex: 1;
    }

    &__filters{
      width: 399px;
      .flats-filter {
        position: sticky;
        top: 20px;
      }
    }

    &__go-top{
      cursor: pointer;
      position: fixed;
      bottom: 32px;
      right: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba($light-block-green, 0.6);
      width: 40px;
      height: 40px;
      border-radius: 100%;
      transition: all 0.3s ease;

      svg {
        color: $light-icon-white;
        width: 8px;
        height: 12px;
      }

      &:hover {
        background: $light-block-green;
      }

      &:active {
        transform: scale(1.1)
      }
    }

    .title{
        @include UI-54-55-700;
        margin-bottom: 48px;
    }

    .base-table{
      margin-bottom: 48px;
    }
}
</style>