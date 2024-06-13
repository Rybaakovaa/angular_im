import {DeliveryType} from "./delivery.type";
import {PaymentType} from "./payment.type";


export type OrderType = {
  deliveryType: DeliveryType,
  firstName: string,
  lastName: string,
  fatherName?: string,
  phone: string,
  paymentType: PaymentType,
  email: string,
  street?: string,
  house?: string,
  entrance?: string,
  apartment?: string,
  comment?: string

  // переменные для ответа с сервера
  items?: {
    id: string,
    quantity: number,
    price: number,
    total: number
  }[],
}