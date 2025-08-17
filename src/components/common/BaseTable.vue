<script setup lang="ts">
// Icons
import ChevronUpIcon from '@/assets/icons/chevron-up.svg'

// Composables
import { useWindow } from '@/composables/useWindow';

// Types
import type { Header, SortDirection } from '@/types/table'

const { middleWindow } = useWindow()

const emit = defineEmits<{
  (e: 'sort', payload: { column: string | null, direction: SortDirection }): void
}>()

const props = defineProps({
  headers: { type: Array as PropType<Header[]>, required: true },
  items: { type: Array as PropType<any[]>, required: true },
  loading: { type: Boolean, default: false },
  loadingMore: { type: Boolean, default: false },
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 20 },
  defaultSort: { type: String || null, default: null },
  defaultSortDirection: { type: String as PropType<SortDirection>, default: null },
  isCustomMobile: { type: Boolean, default: false }
})

const sortBy = ref<string | null>(props.defaultSort)
const sortDirection = ref<SortDirection>(props.defaultSortDirection)

const handleSort = (column: string) => {
  if (sortBy.value === column) {
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
    } else if (sortDirection.value === 'desc') {
      sortDirection.value = null
      sortBy.value = null
    } else {
      sortDirection.value = 'asc'
      sortBy.value = column
    }
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
  
  emit('sort', { 
    column: sortBy.value, 
    direction: sortDirection.value 
  })
}

const filteredHeaders = computed(() => {
  if (middleWindow.value) {
    return props.headers.filter(header => header.sortable !== false)
  }
  return props.headers
})
</script>

<template>
  <div class="base-table">
    <div class="base-table__table-header">
      <div
        v-for="(header, index) in filteredHeaders"
        :key="index"
        class="header-cell"
        :class="[
          `header-cell_${header.align}` || 'header-cell_left',
          { 'header-cell_sortable': header.sortable !== false },
          { 'header-cell_active': sortBy === header.value }
        ]"
        @click="header.sortable !== false ? handleSort(header.value) : null"
      >
        <div class="header-content">
          <slot
            v-if="useSlots()[`header:${header.value}`]"
            :name="`header:${header.value}`"
            :header="header"
          />
          <template v-else>
            {{ header.text }}
          </template>

          <div v-if="header.sortable !== false" class="sort-icons">
            <ChevronUpIcon
              filled
              :class="{ active: sortBy === header.value && sortDirection === 'asc' }"
              class="sort-icons__icon sort-icons__icon_asc"
            />
            <ChevronUpIcon
              filled
              :class="{ active: sortBy === header.value && sortDirection === 'desc' }"
              class="sort-icons__icon sort-icons__icon_desc"
            />
          </div>
        </div>
      </div>
      <div v-if="loading" class="loading-indicator"></div>
    </div>
    <div
      v-if="items.length && (isCustomMobile && middleWindow)"
      class="base-table__table-body"
    >
        <div
          v-for="(item, rowIndex) in items"
          :key="rowIndex"
          class="table-row"
        >
          <slot name="custom-mobile" :item="item"></slot>
      </div>
    </div>
    <div v-else-if="items.length" class="base-table__table-body">
      <div
        v-for="(item, rowIndex) in items"
        :key="rowIndex"
        class="table-row"
      >
        <div
          v-for="(header, colIndex) in headers"
          :key="colIndex"
          class="body-cell"
          :class="[
            `body-cell_${header.align}` || 'body-cell_left',
            { 'is_bold': header.isBoldBody }
          ]"
        >
          <slot
            v-if="useSlots()[header.value]"
            :name="header.value"
            :item="item"
          />
          <template v-else>
            {{ item[header.value] }}
          </template>
        </div>
      </div>
      <div v-if="loadingMore" class="loading-more">
        <div class="circle"></div>
      </div>
    </div>
    <div v-else-if="!loading" class="base-table__table-empty">
      По данным фильтрам ничего не найдено
    </div>
  </div>
</template>
  
<style scoped lang="scss">
@keyframes loadingShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.base-table {
  &__table-header{
    position: relative;
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    padding: 12px 0;

    .loading-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba($light-block-green, 0) 0%,
        rgba($light-block-green, 0.5) 20%,
        $light-block-green 50%,
        rgba($light-block-green, 0.5) 80%,
        rgba($light-block-green, 0) 100%
      );
      background-size: 200% 100%;
      animation: loadingShimmer 4.5s infinite linear;
      transform: translateY(1px);
    }

    .header-cell{
      flex: 1;
      padding: 0 16px;
      font-weight: 500;
      border-radius: 5px;

      &_left {
        text-align: left;
      }
      &_center {
        text-align: center;
      }
      &_right {
        text-align: right;
      }

      &_sortable {
        cursor: pointer;
        user-select: none;

        &:hover {
          background-color: #f5f5f5;
        }
      }

      &_active {
        color: $light-text-active;
      }
    }

    .header-content {
      @include UI-14-20-400;
      display: flex;
      align-items: center;
      gap: 8px;

      .sort-icons {
        display: flex;
        flex-direction: column;

        &__icon{
          transition: all 0.2s;
          width: 10px;
          height: 4px;
          color: $light-icon-default;
          opacity: 0.4;

          &.active {
            color: $light-icon-active;
            opacity: 1;
          }

          &_asc {
            margin-bottom: 2px !important;
          }

          &_desc{
            transform: rotate(180deg);
          }
        }
      }
    }

    @media (max-width: $window-tablet) {
      border-bottom: none;
      .header-cell{
        width: fit-content;
        flex: none;
        padding-left: 0;
        padding-right: 20px;
      }
    }
  }
  &__table-body{
    display: flex;
    flex-direction: column;

    .table-row {
      display: flex;
      border-bottom: 1px solid #f0f0f0;
      padding: 16px 0;

      .body-cell {
        @include UI-16-24-400;
        flex: 1;
        padding: 0 16px;
        line-height: 24px;

        &_left {
          text-align: left;
        }
        &_center {
          text-align: center;
        }
        &_right {
          text-align: right;
        }

        &.is_bold{
          @include UI-16-24-500;
        }
      }
    }

    .loading-more {
      display: flex;
      justify-content: center;
      padding: 16px 0;
      width: 100%;
      .circle{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px 0;
        
        &::after {
          content: "";
          display: block;
          width: 20px;
          height: 20px;
          border: 2px solid $light-block-gray;
          border-top-color: $light-block-green;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      }
    }

    @media (max-width: $window-tablet) {
      .table-row {
        border-bottom: none;
      }
    }
  }
  &__table-empty{
    @include UI-16-24-500;
    padding: 10px 0;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>