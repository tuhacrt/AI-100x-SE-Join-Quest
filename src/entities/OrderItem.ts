import { Product } from './Product';

export class OrderItem {
  constructor(
    public product: Product,
    public quantity: number
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  }
}
