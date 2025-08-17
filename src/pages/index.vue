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

const loading = ref(true)
const loadingMore = ref(false)
const currentPage = ref(1)
const sortValue = ref<SortValue>(null)
const sortDirection = ref<SortDirection>(null)
const pagination = ref<ResponsePagination | null>(null)

const canScroll = ref(false)

const priceRange = ref({ from: 1_000_000, to: 100_000_000 })
const squareRange = ref({ from: 5, to: 300 })
const activeRooms = ref<number[] | []>([])

const headers = ref<Header[]>([
  { text: "Планировка", value: "layout", sortable: false, align: "left" },
  { text: "Квартира", value: "flat", sortable: false, align: "left", isBoldBody: true },
  { text: "S, м²", value: "footage", align: "left" },
  { text: "Этаж", value: "floor", align: "left" },
  { text: "Цена, ₽", value: "price", align: "left" },
])

const items = ref<Flat[]| []>([]);

const loadData = async () => {
  loading.value = true
  if (currentPage.value > 1) loadingMore.value = true
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
    loadingMore.value = false
  }
}

const debouncedLoadData = debounce(() => {
  currentPage.value = 1
  loadData()
}, 300)

const handleSort = async ({ column, direction }: { column: string | null, direction: SortDirection }) => {
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

const checkScroll = () => {
  canScroll.value = document.documentElement.scrollHeight > window.innerHeight && 
                   window.scrollY > 50
}

onMounted(async () => {
  window.addEventListener('scroll', debounce(checkScroll, 100))
  checkScroll()
  await loadData()
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', debounce(checkScroll, 100))
})

watch(
  [priceRange, squareRange, activeRooms],
  () => {
    debouncedLoadData()
  },
  { deep: true }
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
                :loadingMore="loadingMore"
                :page="currentPage"
                is-custom-mobile
                @sort="handleSort"
                >
                <template v-slot:layout="{ item }">
                    <img
                      :src="item.layout.img"
                      :alt="item.flat"
                      width="80"
                      height="80"
                    >
                </template>
                <template v-slot:floor="{ item }">
                    <div class="table-floor-item">
                      {{ parseInt(item.floor.split(' ')[0]) }}
                      <span>из {{ item.floor.split(' ')[2] }}</span>
                    </div>
                </template>
                <template v-slot:price="{ item }">
                    {{ formatedNumber(item.price) }}
                </template>
                <template v-slot:custom-mobile="{ item }">
                    <div class="mobile-body-item">
                        <div class="mobile-body-item__content">
                          <div class="name">{{ item.flat }}</div>
                          <div class="info">
                            <div class="info__item info__item_bold">
                              {{ item.footage }}
                            </div>
                            <div class="info__item">
                              {{ parseInt(item.floor.split(' ')[0]) }}
                              <span>из {{ item.floor.split(' ')[2] }} этаж</span>
                            </div>
                            <div class="info__item info__item_bold">
                              {{ formatedNumber(item.price) }} ₽
                            </div>
                          </div>
                        </div>
                        <div class="mobile-body-item__image">
                          <img
                            :src="item.layout.img"
                            :alt="item.flat"
                            width="80"
                            height="80"
                          >
                        </div>
                    </div>
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
        <Transition name="fade-slide">
          <div 
            v-if="canScroll"
            class="main-page__go-top" 
            @click="scrollTop()"
          >
            <ArrowUpIcon filled />
          </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
/* Анимация появления/исчезания сколла вверх */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

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
      .flats-filter_wrapper {
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

      .table-floor-item{
        span {
          opacity: 0.5;
        }
      }

      @media (max-width: $window-middle-desktop) {
        :deep(.table-row) {
          padding: 0;
          &:first-child{
            padding-top: 4px;
          }
          padding-bottom: 4px;
          border: none;
        }
      }


      .mobile-body-item{
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 16px 24px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        width: 100%;

        &__content{
          display: flex;
          flex-direction: column;
          gap: 16px;
          .name {
            @include UI-14-20-500;
          }
          .info {
            display: flex;
            gap: 20px;
            &__item{
              @include UI-14-20-400;
              &:nth-child(1) {
                width: 40px;
              }
              &:nth-child(2) {
                width: 100px;
              }
              &_bold {
                @include UI-14-20-500;
              }
              span {
                opacity: 0.5;
              }
            }
          }
        }
        &__image {
          width: 80px;
          height: 80px;
        }

        @media (max-width: $window-wide-mobile) {
          flex-direction: column-reverse;

          &__content{
            gap: 5px;
            .info {
              flex-direction: column;
              gap: 5px;
            }
          }
        }
      }
    }

    @media (max-width: $window-middle-desktop) {
      padding-top: 48px;
      padding-bottom: 48px;
      gap: 28px;
      &__filters{
        width: 320px;
      }

      .title{
        margin-bottom: 24px;
      }
    }

    @media (max-width: $window-middle-tablet) {
      width: 100%;
      &__filters {
        position: fixed;
        width: auto;
        bottom: 0;
        left: 0;
        z-index: 100;
      }
    }
}
</style>