<script setup lang="ts">
// Utils
import formatedNumber from '@/utils/formatedNumber'

const props = defineProps({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 5 },
  showValue: { type: Boolean, default: true }
})

const emit = defineEmits(['update:from', 'update:to', 'starDrag', 'stopDrag'])

const minDistance = computed(() => {
  // 14px в процентах от общей ширины, переведенные в значения слайдера
  if (!sliderWrapper.value) return 0
  const sliderWidth = sliderWrapper.value.offsetWidth
  return (14 / sliderWidth) * (props.max - props.min)
})

const sliderWrapper = ref<HTMLElement | null>(null)
let activeThumb: 'from' | 'to' | null = null
let startX = 0
let startValue = 0

const handleInput = (event: Event, emitValue: 'from' | 'to') => {
  const target = event.target as HTMLInputElement
  if (target) {
    let value = Number(target.value)
    if (emitValue === 'from' && value > props.to - minDistance.value) {
      value = props.to - minDistance.value
    } else if (value < props.from + minDistance.value) {
      value = props.from + minDistance.value
    }
    emit(`update:${emitValue}`, value)
  }
}

const startDrag = (thumb: 'from' | 'to', event: MouseEvent | TouchEvent) => {
  event.preventDefault()
  activeThumb = thumb
  startX = getClientX(event)
  startValue = thumb === 'from' ? props.from : props.to
  
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('touchend', stopDrag)
  emit('starDrag')
}

const handleDrag = (event: MouseEvent | TouchEvent) => {
  if (!activeThumb || !sliderWrapper.value) return
  
  const sliderRect = sliderWrapper.value.getBoundingClientRect()
  const sliderWidth = sliderRect.width
  const currentX = getClientX(event)
  const diffX = currentX - startX
  const diffValue = (diffX / sliderWidth) * (props.max - props.min)
  let newValue = startValue + diffValue

  // Ограничиваем значения и учитываем минимальное расстояние
  if (activeThumb === 'from') {
    newValue = Math.max(props.min, Math.min(props.to - minDistance.value, newValue))
  } else {
    newValue = Math.min(props.max, Math.max(props.from + minDistance.value, newValue))
  }
  
  newValue = Math.round(newValue / props.step) * props.step

  if (activeThumb === 'from') {
    emit('update:from', newValue)
  } else {
    emit('update:to', newValue)
  }
}

const stopDrag = () => {
  activeThumb = null
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', stopDrag)
  emit('stopDrag')
}

const getClientX = (event: MouseEvent | TouchEvent): number => {
  return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
}

const rangeStyle = computed(() => ({
  left: `${((props.from - props.min) / (props.max - props.min)) * 100}%`,
  right: `${100 - ((props.to - props.min) / (props.max - props.min)) * 100}%`
}))

onMounted(() => {
  if (props.to - props.from < minDistance.value) {
    const middle = (props.from + props.to) / 2
    emit('update:from', middle - minDistance.value / 2)
    emit('update:to', middle + minDistance.value / 2)
  }
})

onUnmounted(() => {
  // Удаляем обработчики при уничтожении компонента
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', stopDrag)
})
</script>

<template>
    <div class="range-slider">
      <div v-if="showValue" class="range-slider__values">
        <div class="value-item value-item_from">
            <span>от</span> {{ formatedNumber(from) }}
        </div>
        <div class="value-item value-item_to">
            <span>до</span> {{ formatedNumber(to) }}
        </div>
      </div>
      <div class="range-slider__wrapper" ref="sliderWrapper">
        <div class="range-slider__track"></div>
        <div class="range-slider__range" :style="rangeStyle">
          <span 
            class="range-slider__thumb range-slider__thumb--left"
            @mousedown="startDrag('from', $event)"
            @touchstart="startDrag('from', $event)"
          ></span>
          <span 
            class="range-slider__thumb range-slider__thumb--right"
            @mousedown="startDrag('to', $event)"
            @touchstart="startDrag('to', $event)"
          ></span>
        </div>
        <input
          type="range"
          class="range-slider__input"
          :min="min"
          :max="max"
          :step="step"
          :value="from"
          @input="handleInput($event, 'from')"
        />
        <input
          type="range"
          class="range-slider__input"
          :min="min"
          :max="max"
          :step="step"
          :value="to"
          @input="handleInput($event, 'to')"
        />
      </div>
    </div>
</template>
  
<style scoped lang="scss">
.range-slider {
    width: 100%;
    user-select: none;

    &__values {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        margin-bottom: 6px;

        .value-item{
            @include UI-16-24-500;
            span {
                @include UI-14-20-400;
                opacity: 0.5;
            }
        }
    }

    &__wrapper {
        position: relative;
        height: 14px;
        display: flex;
        align-items: center;
        touch-action: none; // Важно для touch-событий
    }

    &__input {
        position: absolute;
        width: 100%;
        height: 0;
        pointer-events: none;
        appearance: none;
        opacity: 0;
        z-index: 3;
    }

    &__track {
        position: absolute;
        width: 100%;
        height: 3px;
        background: rgba($light-text-primary, 0.1);
        border-radius: 1px;
        z-index: 1;
    }

    &__range {
        position: absolute;
        height: 3px;
        background: $light-block-green;
        border-radius: 2px;
        z-index: 2;
    }

    &__thumb {
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: $light-block-green;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        z-index: 3;

        &--left {
            left: -7px;
        }

        &--right {
            right: -7px;
        }

        &:active {
            transform: translateY(-50%) scale(1.2);
        }
    }

    @media (max-width: $window-middle-desktop) {
      &__values {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          margin-bottom: 6px;

          .value-item{
              @include UI-14-20-500;
          }
      }
    }
}
</style>