import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';

export class OrderService {
  private thresholdAmount: number = 0;
  private thresholdDiscount: number = 0;
  private buyOneGetOneCategory: string = '';
  private doubleElevenActive: boolean = false;

  setThresholdDiscount(threshold: number, discount: number): void {
    this.thresholdAmount = threshold;
    this.thresholdDiscount = discount;
  }

  setBuyOneGetOnePromotion(category: string): void {
    this.buyOneGetOneCategory = category;
  }

  setDoubleElevenPromotion(active: boolean): void {
    this.doubleElevenActive = active;
  }

  checkout(items: OrderItem[]): Order {
    const order = new Order();

    // Calculate original amount
    let originalAmount = 0;
    for (const item of items) {
      originalAmount += item.product.unitPrice * item.quantity;
    }

    order.originalAmount = originalAmount;

    // Apply buy-one-get-one promotion if applicable
    const finalItems: OrderItem[] = [];
    for (const item of items) {
      if (this.buyOneGetOneCategory && item.product.category === this.buyOneGetOneCategory) {
        // For each unique cosmetic product, add 1 free unit
        const newQuantity = item.quantity + 1;
        finalItems.push(new OrderItem(item.product, newQuantity));
      } else {
        finalItems.push(item);
      }
    }
    order.items = finalItems;

    // Apply threshold discount or Double Eleven discount
    let discount = 0;

    if (this.doubleElevenActive) {
      // Double Eleven: For every 10 units of same product, get 2 units free (20% discount)
      for (const item of items) {
        if (item.quantity >= 10) {
          const completeSets = Math.floor(item.quantity / 10);
          discount += completeSets * 2 * item.product.unitPrice;
        }
      }
    } else if (this.thresholdAmount > 0 && originalAmount >= this.thresholdAmount) {
      discount = this.thresholdDiscount;
    }

    order.discount = discount;
    order.totalAmount = originalAmount - discount;

    return order;
  }
}
