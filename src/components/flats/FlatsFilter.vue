<script setup lang="ts">
// Icons
import CrossIcon from '@/assets/icons/cross.svg'
import FilterFunnelIcon from '@/assets/icons/filter-funnel.svg'

// Components
import RangeSlider from '@/components/common/RangeSlider.vue'

// Composables
import { useWindow } from '@/composables/useWindow';

const { middleTabletWindow } = useWindow()

const emit = defineEmits([
    'update:priceRange',
    'update:squareRange',
    'update:activeRooms',
    'reset'
])

const props = defineProps({
  priceRange: { type: Object as PropType<{ from: number, to: number }>, required: true },
  squareRange: { type: Object as PropType<{ from: number, to: number }>, required: true },
  activeRooms: { type: Array<Number> || [], required: true }
})

// Инициализация cookie
const filtersCookie = useCookie('flatFilters', {
  default: () => ({
    priceRange: { from: 1_000_000, to: 100_000_000 },
    squareRange: { from: 5, to: 300 },
    activeRooms: [] as number[]
  }),
  watch: true,
  maxAge: 60 * 60 * 24 * 7 // 7 дней
})

const showFilters = ref<boolean>(false);

const rooms = [
  { name: "1к", value: 1},
  { name: "2к", value: 2},
  { name: "3к", value: 3},
  { name: "4к", value: 4},
] as Array<{ name: string, value: number }>

const filterItems = [
  {title: "Стоимость квартиры, ₽", from: 1_000_000, to: 100_000_000, step: 100_000, value: 'priceRange' },
  {title: "Площадь, м²", from: 5, to: 300, step: 5, value: 'squareRange' },
]

const priceRange = ref(props.priceRange)
const squareRange = ref(props.squareRange)
const activeRooms = ref(props.activeRooms)

const getRange = (value: string) => {
  switch(value) {
    case 'priceRange': return priceRange
    case 'squareRange': return squareRange
    default: return priceRange
  }
}

const changeRooms = (value: number) => {
  if (activeRooms.value.includes(value)) {
    activeRooms.value = activeRooms.value.filter(item => item !== value);
  } else {
    activeRooms.value.push(value)
  }
}

const reset = () => {
  const filterItemsPrice = filterItems.find(item => item.value === 'priceRange')
  const filterItemsSquare = filterItems.find(item => item.value === 'squareRange')
  
  // Сброс к значениям по умолчанию
  if (filterItemsPrice) {
    priceRange.value = { from: filterItemsPrice.from, to: filterItemsPrice.to }
    emit('update:priceRange', priceRange.value)
  }
  
  if (filterItemsSquare) {
    squareRange.value = { from: filterItemsSquare.from, to: filterItemsSquare.to }
    emit('update:squareRange', squareRange.value)
  }
  
  activeRooms.value = []
  emit('update:activeRooms', activeRooms.value)
  
  // Очищаем cookie, устанавливая значения по умолчанию
  filtersCookie.value = {
    priceRange: { from: filterItemsPrice?.from || 1_000_000, to: filterItemsPrice?.to || 100_000_000 },
    squareRange: { from: filterItemsSquare?.from || 5, to: filterItemsSquare?.to || 300 },
    activeRooms: []
  }
  
  emit('reset')
}

onMounted(() => {
  if (filtersCookie.value) {
    if (filtersCookie.value.priceRange) {
      priceRange.value = filtersCookie.value.priceRange
      emit('update:priceRange', filtersCookie.value.priceRange)
    }
    if (filtersCookie.value.squareRange) {
      squareRange.value = filtersCookie.value.squareRange
      emit('update:squareRange', filtersCookie.value.squareRange)
    }
    if (filtersCookie.value.activeRooms) {
      activeRooms.value = filtersCookie.value.activeRooms
      emit('update:activeRooms', filtersCookie.value.activeRooms)
    }
  }
})

// Сохранение фильтров в cookie при изменении
watch([priceRange, squareRange, activeRooms], ([newPrice, newSquare, newRooms]) => {
  filtersCookie.value = {
    priceRange: newPrice,
    squareRange: newSquare,
    activeRooms: newRooms 
  }
}, { deep: true })
</script>

<template>
    <div class="flats-filter_wrapper">
      <Transition name="fade-slide">
        <div v-if="(middleTabletWindow && showFilters) || !middleTabletWindow" class="flats-filter">
            <div class="flats-filter__rooms">
                <div
                    v-for="room in rooms"
                    :key="`room-${room.value}`"
                    class="room-item"
                    :class="{'room-item_active': activeRooms.includes(room.value)}"
                    @click="changeRooms(room.value)"
                >
                    {{ room.name }}
                </div>
            </div>
            <div class="flats-filter__items">
                <div
                    v-for="(filterItem, filterItemIndex) in filterItems"
                    :key="`filterItem-${filterItemIndex}`"
                    class="filter-item"
                >
                    <div class="filter-item__title">{{ filterItem.title }}</div>
                    <RangeSlider
                        v-model:from="getRange(filterItem.value).value.from"
                        v-model:to="getRange(filterItem.value).value.to"
                        :min="filterItem.from"
                        :max="filterItem.to"
                        :step="filterItem.step"
                        show-value
                    />
                </div>
            </div>
            <div
                class="flats-filter__reset"
                @click="reset()"
            >
                Сбросить параметры
                <CrossIcon filed />
            </div>
            <div
              v-if="middleTabletWindow"
              class="flats-filter__close"
              @click="showFilters = false"
            >
              <CrossIcon filled />
            </div>
        </div>
      </Transition>
      <div
        v-if="middleTabletWindow && showFilters"
        class="flats-filter__bg"
        @click="showFilters = false"
      >

      </div>
      <div
        v-if="middleTabletWindow && !showFilters"
        class="flats-filter__mobile-icon"
        @click="showFilters = true"
      >
        <FilterFunnelIcon filled />
      </div>
    </div>
</template>

<style scoped lang="scss">
/* Анимация появления/исчезания блока в мобильной версии */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.flats-filter{
    padding: 40px;
    background: $light-gradient-green;
    border-radius: 10px;
    height: fit-content;
    width: 100%;

    &_wrapper{
      position: relative;
    }

    &__bg{
      position: fixed;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      background: rgba($light-text-primary, 0.2);
    }

    &__mobile-icon{
      cursor: pointer;
      position: fixed;
      top: 32px;
      right: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $light-text-primary;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);

      svg {
        color: $light-icon-white;
      }
    }

    &__rooms{
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 24px;

        .room-item{
            cursor: pointer;
            @include UI-16-24-400;
            display: flex;
            align-items: center;
            justify-content: center;
            background: $light-block-primary;
            border-radius: 100%;
            width: 44px;
            height: 44px;
            transition: all 0.3s ease;

            &_active {
                background: $light-block-green;
                color: $light-text-white;
            }

            &:hover {
                background: rgba($light-block-green, 0.5);
            }
        }
    }

    &__items{
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-bottom: 24px;
        .filter-item{
            &__title{
                @include UI-14-20-400;
                margin-bottom: 8px;
            }
        }
    }

    &__reset {
        @include UI-14-20-400;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 5px 16px;
        transition: all 0.3s ease;

        svg {
            width: 8px;
            height: 8px;
            transition: all 0.3s ease;
            margin-bottom: 0;
        }

        &:hover {
            color: $light-text-active;

            svg {
               color: $light-icon-active; 
            }
        }
    }

    &__close{
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 20px;
      right: 20px;
      border: 1px solid rgba($light-block-black, 0.5);
      border-radius: 4px;
      width: 28px;
      height: 28px;

      svg {
        width: 12px;
        height: 12px;
        margin-bottom: 0;
      }
    }

    @media (max-width: $window-middle-desktop) {
      padding: 20px;

      &__items{
        .filter-item{
          &__title{
            @include UI-13-18-400;
          }
        }
      }
    }

    @media (max-width: $window-middle-tablet) {
      position: relative;
      width: 100dvw;
      bottom: 0;
      z-index: 100;
      background: $light-block-primary;
      box-shadow: 0 -4px 8px 4px rgba(0, 0, 0, 0.05);
      border-radius: 10px 10px 0 0;

      &__rooms{
        .room-item{
          border: 1px solid rgba($light-block-black, 0.5);

          &_active {
            border: none;
          }
        }
      }
    }
}
</style>