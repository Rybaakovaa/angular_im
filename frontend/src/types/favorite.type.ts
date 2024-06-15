export type FavoriteType = {
  id: string,
  name: string,
  url: string,
  image: string,
  price: number,

  // перемнная для кол-ва товаров в корзине
  count?: number
}
