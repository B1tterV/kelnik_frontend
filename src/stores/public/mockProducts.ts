export const generateMockProducts = (count) => {
    const mockProducts = [];

    const getTag = (num: number) => {
        if (num === 1) return "New"
        if (num === 2) return "%"
        return "Хит"
    }
    
    for (let i = 1; i <= count; i++) {
      mockProducts.push({
        tag: getTag(Math.floor(Math.random() * 3) + 1), // Чередуем теги
        image: `/images/products/new-product-${i % 10 || 10}.png`, // 10 разных изображений
        prevPrice: 900 + Math.floor(Math.random() * 200), // Случайная цена 900-1100
        currentPrice: 500 + Math.floor(Math.random() * 200), // Случайная цена 500-700
        code: 1285700 + i,
        description: `Кирпич ручной работы ${['WO14', 'WO15', 'WO16'][i % 3]} ${['Болдино', 'Красное', 'Белое'][i % 3]} ТМ ${['Донские зори', 'Волга', 'Урал'][i % 3]}`
      });
    }
    
    return mockProducts;
};
  
export const newProductCards = generateMockProducts(24);