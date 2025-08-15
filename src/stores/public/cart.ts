import { defineStore, acceptHMRUpdate } from "pinia";
import { computed, ref } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cart = ref<any>([]);

  const totalCartPrice = computed(() => {
    let totalPrice = 0;
    cart.value.map(item => totalPrice += item.price)
    return totalPrice
  })

  return {
    cart,
    totalCartPrice
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
