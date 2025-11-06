import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from "bun:test";
import { OrderService } from '../../src/services/OrderService';
import { Product } from '../../src/entities/Product';
import { OrderItem } from '../../src/entities/OrderItem';
import { Order } from '../../src/entities/Order';

let orderService: OrderService;
let orderItems: OrderItem[] = [];
let resultOrder: Order;

Given('no promotions are applied', function () {
  orderService = new OrderService();
  orderItems = [];
});

Given('the threshold discount promotion is configured:', function (dataTable: DataTable) {
  const config = dataTable.hashes()[0]!;
  if (!orderService) {
    orderService = new OrderService();
  }
  orderService.setThresholdDiscount(
    parseInt(config.threshold!),
    parseInt(config.discount!)
  );
  orderItems = [];
});

Given('the buy one get one promotion for cosmetics is active', function () {
  if (!orderService) {
    orderService = new OrderService();
  }
  orderService.setBuyOneGetOnePromotion('cosmetics');
  orderItems = [];
});

Given('the Double Eleven Festival promotion is active', function () {
  orderService = new OrderService();
  orderService.setDoubleElevenPromotion(true);
  orderItems = [];
});

When('a customer places an order with:', function (dataTable: DataTable) {
  const rows = dataTable.hashes();

  orderItems = rows.map(row => {
    const product = new Product(
      row.productName!,
      parseInt(row.unitPrice!),
      row.category || 'general'
    );
    return new OrderItem(product, parseInt(row.quantity!));
  });

  resultOrder = orderService.checkout(orderItems);
});

Then('the order summary should be:', function (dataTable: DataTable) {
  const expected = dataTable.hashes()[0]!;

  if (expected.totalAmount) {
    expect(resultOrder.totalAmount).toBe(parseInt(expected.totalAmount));
  }

  if (expected.originalAmount) {
    expect(resultOrder.originalAmount).toBe(parseInt(expected.originalAmount));
  }

  if (expected.discount) {
    expect(resultOrder.discount).toBe(parseInt(expected.discount));
  }
});

Then('the customer should receive:', function (dataTable: DataTable) {
  const expectedItems = dataTable.hashes();

  expect(resultOrder.items.length).toBe(expectedItems.length);

  expectedItems.forEach((expectedItem, index) => {
    expect(resultOrder.items[index]?.product.name).toBe(expectedItem.productName);
    expect(resultOrder.items[index]?.quantity).toBe(parseInt(expectedItem.quantity!));
  });
});
