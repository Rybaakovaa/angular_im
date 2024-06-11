export type ProductType = {
  id: string,
  name: string,
  price: number,
  image: string,
  lightning: string,
  humidity: string,
  temperature: string,
  height: number,
  diameter: number,
  url: string,
  type: {
    id: string,
    name: string,
    url: string
  },

  // опциональные флаги, заполняются при работе с интерфейсом
  countInCart?: number,
  isInFavorite?: boolean
}
