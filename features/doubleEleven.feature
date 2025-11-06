@order_pricing
Feature: E-commerce Order Double Eleven Festival Pricing Promotions
  As a shopper
  I plan to participate in Double Eleven Festival sales.
  If the Double Eleven's promotions are turned on.
  Every product in the order more than or equal to 10 will get a 20% discount for 10 units.
  Which means for every 10 units of the same product, 2 units are free.
  So that I can understand how much to pay and what items I will receive.

  Scenario: Single product with 12 units during Double Eleven Festival
    Given the Double Eleven Festival promotion is active
    When a customer places an order with:
      | productName | quantity | unitPrice |
      | Socks       | 12       | 100       |
    Then the order summary should be:
      | originalAmount | discount | totalAmount |
      | 1200           | 200      | 1000        |
    And the customer should receive:
      | productName | quantity |
      | Socks       | 12       |

  Scenario: Single product with 27 units during Double Eleven Festival
    Given the Double Eleven Festival promotion is active
    When a customer places an order with:
      | productName | quantity | unitPrice |
      | Socks       | 27       | 100       |
    Then the order summary should be:
      | originalAmount | discount | totalAmount |
      | 2700           | 400      | 2300        |
    And the customer should receive:
      | productName | quantity |
      | Socks       | 27       |

  Scenario: 10 different products with total 10 units during Double Eleven Festival
    Given the Double Eleven Festival promotion is active
    When a customer places an order with:
      | productName | quantity | unitPrice |
      | Product1    | 1        | 50        |
      | Product2    | 1        | 60        |
      | Product3    | 1        | 70        |
      | Product4    | 1        | 80        |
      | Product5    | 1        | 90        |
      | Product6    | 1        | 100       |
      | Product7    | 1        | 110       |
      | Product8    | 1        | 120       |
      | Product9    | 1        | 130       |
      | Product10   | 1        | 140       |
    Then the order summary should be:
      | originalAmount | discount | totalAmount |
      | 950            | 0        | 950         |
    And the customer should receive:
      | productName | quantity |
      | Product1    | 1        |
      | Product2    | 1        |
      | Product3    | 1        |
      | Product4    | 1        |
      | Product5    | 1        |
      | Product6    | 1        |
      | Product7    | 1        |
      | Product8    | 1        |
      | Product9    | 1        |
      | Product10   | 1        |
