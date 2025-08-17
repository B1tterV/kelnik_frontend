<script setup lang="ts">
// Icons
import CrossIcon from '@/assets/icons/cross.svg'

// Components
import RangeSlider from '@/components/common/RangeSlider.vue'

const emit = defineEmits([
    'update:priceRange',
    'update:squareRange',
    'update:activeRooms',
])

const props = defineProps({
  priceRange: { type: Object as PropType<{ from: number, to: number }>, required: true },
  squareRange: { type: Object as PropType<{ from: number, to: number }>, required: true },
  activeRooms: { type: Array<Number> || [], required: true }
})

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

const proxyPriceRange = computed({
  get() {
    return props.priceRange
  },
  set (newValue) {
    emit('update:priceRange', newValue)
  }
})

const proxySquareRange = computed({
  get() {
    return props.squareRange
  },
  set (newValue) {
    emit('update:squareRange', newValue)
  }
})

const proxyActiveRooms = computed({
  get() {
    return props.activeRooms
  },
  set (newValue) {
    emit('update:activeRooms', newValue)
  }
})

const getRange = (value: string) => {
  switch(value) {
    case 'priceRange': return proxyPriceRange
    case 'squareRange': return proxySquareRange
    default: return proxyPriceRange
  }
}

const changeRooms = (value: number) => {
  if (proxyActiveRooms.value.includes(value)) {
    proxyActiveRooms.value = proxyActiveRooms.value.filter(item => item !== value);
  } else {
    proxyActiveRooms.value.push(value)
  }
}

const reset = () => {
    const filterItemsPrice = filterItems.find(item => item.value === 'priceRange')
    const filterItemsSquare = filterItems.find(item => item.value === 'squareRange')
    if (filterItemsPrice)
        proxyPriceRange.value = { from: filterItemsPrice.from, to: filterItemsPrice.to }
    if (filterItemsSquare)
        proxySquareRange.value = { from: filterItemsSquare.from, to: filterItemsSquare.to }
    proxyActiveRooms.value = []
}
</script>

<template>
    <div class="flats-filter">
        <div class="flats-filter__rooms">
            <div
                v-for="room in rooms"
                :key="`room-${room.value}`"
                class="room-item"
                :class="{'room-item_active': proxyActiveRooms.includes(room.value)}"
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
    </div>
</template>

<style scoped lang="scss">
.flats-filter{
    padding: 40px;
    background: $light-gradient-green;
    border-radius: 10px;
    height: fit-content;
    width: 100%;

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
        }

        &:hover {
            color: $light-text-active;

            svg {
               color: $light-icon-active; 
            }
        }
    }
}
</style>