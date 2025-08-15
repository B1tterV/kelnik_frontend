import { computed } from "vue";

export const useWindow = () => {
  // девайс
  const viewport = useViewport();

  // проверяем: ширина экрана от 1439px (включительно) и выше
  const largeWindow = computed(() => {
    return viewport.isGreaterThan("desktopWide");
  });

  // проверяем: ширина экрана до 1439px (включительно)
  const middleWindow = computed(() => {
    return viewport.isLessThan("desktopMedium");
  });
  // проверяем: ширина экрана до 1220 (включительно)
  const tabletWindow = computed(() => {
    return viewport.isLessThan("tablet");
  });
  // проверяем: ширина экрана до 1024 (включительно)
  const smallWindow = computed(() => {
    return viewport.isLessThan("mobile");
  });

  return {
    largeWindow,
    middleWindow,
    tabletWindow,
    smallWindow,
  };
};

