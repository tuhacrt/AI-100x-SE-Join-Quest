from typing import List
from src.order_item import OrderItem
from src.order import Order


class OrderService:
    def __init__(self):
        self.threshold_discount_threshold = None
        self.threshold_discount_amount = None
        self.bogo_cosmetics_enabled = False

    def set_threshold_discount(self, threshold: float, discount: float) -> None:
        self.threshold_discount_threshold = threshold
        self.threshold_discount_amount = discount

    def enable_bogo_cosmetics(self) -> None:
        self.bogo_cosmetics_enabled = True

    def checkout(self, items: List[OrderItem]) -> Order:
        order = Order()

        subtotal = self._calculate_subtotal(items)
        order.original_amount = subtotal

        discount = self._apply_threshold_discount(subtotal)
        order.discount = discount
        order.total_amount = subtotal - discount

        self._build_items_to_receive(order, items)
        self._apply_bogo_cosmetics(order, items)

        return order

    def _apply_threshold_discount(self, subtotal: float) -> float:
        if self.threshold_discount_threshold is not None:
            if subtotal >= self.threshold_discount_threshold:
                return self.threshold_discount_amount
        return 0.0

    def _calculate_subtotal(self, items: List[OrderItem]) -> float:
        total = 0.0
        for item in items:
            total += item.product.unit_price * item.quantity
        return total

    def _build_items_to_receive(self, order: Order, items: List[OrderItem]) -> None:
        for item in items:
            order.items_to_receive.append({
                'productName': item.product.name,
                'quantity': item.quantity
            })

    def _apply_bogo_cosmetics(self, order: Order, items: List[OrderItem]) -> None:
        if not self.bogo_cosmetics_enabled:
            return

        # For each unique cosmetic product purchased, add 1 free item
        for i, received_item in enumerate(order.items_to_receive):
            order_item = self._find_order_item_by_name(items, received_item['productName'])
            if order_item and order_item.product.category == 'cosmetics':
                order.items_to_receive[i]['quantity'] += 1

    def _find_order_item_by_name(self, items: List[OrderItem], product_name: str) -> OrderItem:
        for item in items:
            if item.product.name == product_name:
                return item
        return None
