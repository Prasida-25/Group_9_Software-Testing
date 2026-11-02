@cart
Feature: Quan ly gio hang theo quy tac server
  Cac scenario dung fixture moi trong bo nho, khong ket noi MySQL.

  @REQ-CART-04 @REQ-CART-05 @UC-09
  Scenario: Them lai cung bien the phai gop dong va khong tru kho
    Given a new cart with product stock 5
    When customer 1 adds quantity "1"
    And customer 1 adds quantity "1"
    Then customer 1 has one cart line with quantity 2
    And product stock remains 5

  @REQ-CART-02 @UC-09
  Scenario Outline: Tu choi so luong khong hop le
    Given a new cart with product stock 120
    When customer 1 adds quantity "<quantity>"
    Then the operation is rejected with status 422
    And customer 1 has an empty cart
    And product stock remains 120

    Examples:
      | quantity |
      | 0        |
      | -1       |
      | 1.5      |
      | 100      |

  @REQ-CART-02 @UC-09
  Scenario: Tu choi vuot kho sau khi cong so luong cu
    Given a new cart with product stock 5
    And customer 1 already has quantity 4
    When customer 1 adds quantity "2"
    Then the operation is rejected with status 422
    And customer 1 has one cart line with quantity 4
    And product stock remains 5

  @REQ-ACCESS-01 @UC-11
  Scenario: Khach khac khong xoa duoc dong gio cua chu so huu
    Given a new cart with product stock 5
    And customer 1 already has quantity 2
    When customer 2 removes customer 1 cart line
    Then the operation is rejected with status 404
    And customer 1 has one cart line with quantity 2
    And customer 2 has an empty cart

  @REQ-CART-03 @UC-10
  Scenario: Cap nhat so luong la thay the khong phai cong them
    Given a new cart with product stock 5
    And customer 1 already has quantity 2
    When customer 1 changes quantity to "3"
    Then customer 1 has one cart line with quantity 3
    And product stock remains 5

  @REQ-CART-03 @UC-11
  Scenario: Chu so huu xoa dong gio cua minh
    Given a new cart with product stock 5
    And customer 1 already has quantity 2
    When customer 1 removes customer 1 cart line
    Then the operation succeeds
    And customer 1 has an empty cart
    And product stock remains 5
