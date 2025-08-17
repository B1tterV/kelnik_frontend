<script setup lang="ts">
// Icons
import ChevronUpIcon from '@/assets/icons/chevron-up.svg'

// Types
import type { Header, SortDirection } from '@/types/table'

const emit = defineEmits<{
  (e: 'sort', payload: { column: string | null, direction: SortDirection }): void
}>()

const props = defineProps({
  headers: { type: Array as PropType<Header[]>, required: true },
  items: { type: Array as PropType<any[]>, required: true },
  loading: { type: Boolean, default: false },
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 20 },
  defaultSort: { type: String || null, default: null },
  defaultSortDirection: { type: String as PropType<SortDirection>, default: null },
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
</script>

<template>
  <div class="base-table">
    <div class="base-table__table-header">
      <div
        v-for="(header, index) in headers"
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
    </div>
    <div class="base-table__table-body">
      <div
        v-for="(item, rowIndex) in items"
        :key="rowIndex"
        class="table-row"
      >
        <div
          v-for="(header, colIndex) in headers"
          :key="colIndex"
          class="body-cell"
          :class="`body-cell_${header.align}` || 'body-cell_left'"
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
    </div>
  </div>
</template>
  
<style scoped lang="scss">
.base-table {
  &__table-header{
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    padding: 12px 0;

    .header-cell{
      flex: 1;
      padding: 0 16px;
      font-weight: 500;

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

          &_desc{
            transform: rotate(180deg);
          }
        }
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
        flex: 1;
        padding: 0 16px;

        &_left {
          text-align: left;
        }
        &_center {
          text-align: center;
        }
        &_right {
          text-align: right;
        }
      }
    }
  }
}
</style>