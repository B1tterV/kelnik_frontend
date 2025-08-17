import { computed } from "vue";

export const useWindow = () => {
  // девайс
  const viewport = useViewport();

  // проверяем: ширина экрана до 1439px (включительно)
  const middleWindow = computed(() => {
    return viewport.isLessThan("desktop");
  });
  // проверяем: ширина экрана до 960 (включительно)
  const tabletWindow = computed(() => {
    return viewport.isLessThan("tablet");
  });

  // проверяем: ширина экрана до 750 (включительно)
  const middleTabletWindow = computed(() => {
    return viewport.isLessThan("middleTablet");
  });

  // проверяем: ширина экрана до 375 (включительно)
  const smallWindow = computed(() => {
    return viewport.isLessThan("mobile");
  });

  return {
    middleWindow,
    tabletWindow,
    middleTabletWindow,
    smallWindow,
  };
};

