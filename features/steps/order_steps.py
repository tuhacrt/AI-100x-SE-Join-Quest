from behave import given, when, then
from src.product import Product
from src.order_item import OrderItem
from src.order_service import OrderService


@given('no promotions are applied')
def step_no_promotions(context):
    context.order_service = OrderService()


@given('the threshold discount promotion is configured:')
def step_threshold_promotion(context):
    if not hasattr(context, 'order_service'):
        context.order_service = OrderService()
    for row in context.table:
        threshold = float(row['threshold'])
        discount = float(row['discount'])
        context.order_service.set_threshold_discount(threshold, discount)


@given('the buy one get one promotion for cosmetics is active')
def step_bogo_cosmetics(context):
    if not hasattr(context, 'order_service'):
        context.order_service = OrderService()
    context.order_service.enable_bogo_cosmetics()


@when('a customer places an order with:')
def step_place_order(context):
    items = []
    for row in context.table:
        product_name = row['productName']
        quantity = int(row['quantity'])
        unit_price = float(row['unitPrice'])
        category = row.get('category', 'general')

        product = Product(product_name, unit_price, category)
        order_item = OrderItem(product, quantity)
        items.append(order_item)

    context.order = context.order_service.checkout(items)


@then('the order summary should be:')
def step_verify_order_summary(context):
    for row in context.table:
        if 'totalAmount' in row.headings:
            expected_total = float(row['totalAmount'])
            assert context.order.total_amount == expected_total, \
                f"Expected total amount {expected_total}, but got {context.order.total_amount}"

        if 'originalAmount' in row.headings:
            expected_original = float(row['originalAmount'])
            assert context.order.original_amount == expected_original, \
                f"Expected original amount {expected_original}, but got {context.order.original_amount}"

        if 'discount' in row.headings:
            expected_discount = float(row['discount'])
            assert context.order.discount == expected_discount, \
                f"Expected discount {expected_discount}, but got {context.order.discount}"


@then('the customer should receive:')
def step_verify_items_received(context):
    expected_items = {}
    for row in context.table:
        product_name = row['productName']
        quantity = int(row['quantity'])
        expected_items[product_name] = quantity

    actual_items = {}
    for item in context.order.items_to_receive:
        actual_items[item['productName']] = item['quantity']

    assert actual_items == expected_items, \
        f"Expected items {expected_items}, but got {actual_items}"
