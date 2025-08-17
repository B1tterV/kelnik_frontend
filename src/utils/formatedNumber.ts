/**
 * Форматирование:
 * добавления разделительного пробела (н-р, 2 000 вместо 2000)
 * @param value число
 */
export default function (value: number) {
  return Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);
}
  