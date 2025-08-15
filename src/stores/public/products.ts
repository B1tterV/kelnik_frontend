import { defineStore, acceptHMRUpdate } from "pinia";

// Icons
import HomeSmileIcon from '@/assets/icons/nav-cards/home-smile.svg'
import ForIcon from '@/assets/icons/nav-cards/for.svg'
import KrovlyaIcon from '@/assets/icons/nav-cards/krovlya.svg'
import layersThreeIcon from '@/assets/icons/nav-cards/layers-three-02.svg'
import PaintbucketIcon from '@/assets/icons/nav-cards/paintbucket.svg'
import FormatSquareIcon from '@/assets/icons/nav-cards/format-square.svg'
import MenuIcon from '@/assets/icons/nav-cards/menu-03.svg'

// Types
import type { CatalogNavCard } from '@/types/catalog'

export const useProductsStore = defineStore("products", () => {

  const menuNavCards = ref<CatalogNavCard[] | null>(null)

  async function getCategories() {
    // const response = await useApi(`/api/categories`, {
    //   method: "GET",
    // }, {});

    // return response;

    return {
      status: {
        value: "success"
      },
      data: {
        value: [
          { id: 1, icon: HomeSmileIcon, name: "Благоустройство", slug: 'catalog' },
          { id: 2, icon: ForIcon, name: "Облицовочный кирпич", slug: 'catalog' },
          { id: 3, icon: KrovlyaIcon, name: "Кровельные материалы", slug: 'catalog' },
          { id: 4, icon: layersThreeIcon, name: "Обустройство кровли", slug: 'catalog' },
          { id: 5, icon: PaintbucketIcon, name: "Строительные смеси", slug: 'catalog' },
          { id: 6, icon: FormatSquareIcon, name: "Тротуарная плитка", slug: 'catalog' },
        ]
      }
    }
  }

  async function getSubcategories(id: number) {
    const response = await useApi(`/api/subcategories/${id}`, {
      method: "GET",
    }, {});

    return response;
  }

  async function getProducts(subcategorySlug: string) {
    const response = await useApi(`/api/products/subcategory/${subcategorySlug}`, {
      params: {
        page: 1,
        pageSize: 48,
      },
      method: "GET",
    }, {});

    return response;
  }

  async function getProduct(productSlug: string) {
    const response = await useApi(`/api/products/details/${productSlug}`, {
      method: "GET",
    }, {});

    return response;
  }

  return {
    menuNavCards,
    getCategories,
    getSubcategories,
    getProducts,
    getProduct
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot));
}
