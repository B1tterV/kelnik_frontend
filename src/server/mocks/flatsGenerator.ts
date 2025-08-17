import type { Flat } from '@/types/flat'
  
export const generateMockFlats = (count = 50): Flat[] => {
  const mockLayouts = [
    { img: "/images/mock/mock-layout.png", width: 80, height: 80 },
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const rooms = Math.floor(Math.random() * 4) + 1;
    const footage = (Math.random() * 200 + 30).toFixed(1).replace(".", ",");
    const currentFloor = Math.floor(Math.random() * 17) + 1;
    const floor = `${currentFloor} из 17`;
    const price = (Math.random() * 90_000_000 + 1_000_000);
  
    return {
      id: `flat-${i}`,
      layout: mockLayouts[0],
      flat: `${rooms}-комнатная №${100 + i}`,
      footage,
      floor,
      price,
      rooms,
    };
  });
};