@shipping @REQ-SHIP-01 @UC-13
Feature: Tinh phi van chuyen COD khong voucher
  Phi van chuyen duoc tinh tu tien hang tai server.

  Scenario Outline: Phi van chuyen o bien 300000 dong
    Given a valid product priced "<price>" with quantity 1
    When the server calculates the quote
    Then subtotal is "<price>" shipping is "<shipping>" and total is "<total>"

    Examples:
      | price     | shipping | total     |
      | 299999.00 | 30000.00 | 329999.00 |
      | 300000.00 | 0.00     | 300000.00 |
      | 300001.00 | 0.00     | 300001.00 |
