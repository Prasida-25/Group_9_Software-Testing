# Đối chiếu 59 test case với bằng chứng hiện có

Bảng này là rà soát hồi cứu ngày 02/11/2026, không phải nhật ký thực thi mới. Bản thiết kế gốc giữ nguyên. “Một phần” nghĩa là có phép kiểm tra liên quan đã chạy, nhưng chưa đủ dữ liệu, tầng kiểm thử, bước hoặc hậu điều kiện để gán Pass toàn ca. Fixture tương đương có thể dùng nếu được lập luận đầy đủ; bảng hiện tại chưa có hồ sơ tương đương toàn ca. Không dùng số dòng này để tính tỷ lệ Pass.

“Sai khác” ghi một kỳ vọng không đáp ứng đã có ảnh/test xác nhận; không có nghĩa mọi bước khác trong ca đều đã chạy. “Chưa có lượt đúng ca” không khẳng định chức năng lỗi.

| TC | UC | Yêu cầu | Ưu tiên | Kết luận đối chiếu | Bằng chứng | Phần đã có / còn thiếu |
|---|---|---|---|---|---|---|
| TC-AUTH-01 | UC-01 | UC-01; REQ-AUTH-01, REQ-AUTH-02, REQ-SEC-01. | P1 | Một phần | MEM test 4; SQL real-HTTP-account-catalog-and-purchase; ảnh register-success | Đăng ký, role user, hash và không tự đăng nhập có test; chưa có nhật ký một lượt khớp toàn bộ fixture TC. |
| TC-AUTH-02 | UC-01 | UC-01; REQ-AUTH-01. | P2 | Một phần | MEM test 4; PBT | Có input rỗng/mật khẩu ngắn; chưa đủ 0/1/100/101 và 7/8/128/129 qua HTTP. |
| TC-AUTH-03 | UC-01 | UC-01; REQ-AUTH-02. | P1 | Một phần | MEM test 4–5; SQL real-HTTP-account-catalog-and-purchase | Có chuẩn hóa +84, 409 và không tăng số user ở mock; chưa đối chiếu trọn vẹn fixture MySQL TC. |
| TC-AUTH-04 | UC-01 | UC-01; REQ-AUTH-01. | P2 | Một phần | MEM test 4 | Có mật khẩu ngắn và xác nhận sai; chưa đủ hai dữ liệu chỉ chữ/chỉ số và HTML không điền lại từng lượt. |
| TC-AUTH-05 | UC-02 | UC-02; REQ-AUTH-03. | P1 | Một phần | MEM test 2; PM07; SEL01; ảnh admin | Có điều hướng user/admin ở HTTP mock và user qua browser; chưa ghép hai vai trò cùng nhật ký fixture MySQL TC. |
| TC-AUTH-06 | UC-02 | UC-02; REQ-AUTH-03. | P1 | Một phần | MEM test 1–2,6; PM06; SEL02 | Sai mật khẩu/thông báo chung và returnTo có test; cần liên kết rõ lượt đăng nhập đúng với URL ngoài và đích an toàn. |
| TC-AUTH-07 | UC-02 | UC-02; REQ-AUTH-03; LOGIN-R05–LOGIN-R07. | P2 | Một phần | MEM test 7 | Mock đặt pairMax=2, không phải mặc định 5; chưa kiểm tra lần 6 và hết cửa sổ bằng clock. |
| TC-AUTH-08 | UC-02 | UC-02; REQ-AUTH-03; LOGIN-R05–LOGIN-R07. | P2 | Chưa có lượt đúng ca | Không có lượt tương ứng | Chưa có 30 lần sai đổi số rồi request 31 với ipMax mặc định. |
| TC-AUTH-09 | UC-03 | UC-03; REQ-AUTH-04. | P1 | Một phần | MEM test 6; PM13–14; SEL06 | Cookie trước logout bị từ chối ở /account trong mock; PM/browser kiểm tra /cart. Chưa phát lại cookie cũ vào /orders trên MySQL đúng TC. |
| TC-CAT-01 | UC-04 | UC-04; REQ-PROD-01, REQ-PROD-04. | P2 | Sai khác | MEM catalog test HTTP/card; ảnh catalog-list, variant-black, variant-white | Sai khác đã quan sát: sản phẩm nhiều mức giá chỉ hiển thị giá thấp nhất, thiếu chữ từ; SPEC-GAP-001. Không đánh dấu toàn ca Pass. |
| TC-CAT-02 | UC-04 | UC-04; REQ-PROD-01. | P2 | Một phần | MEM catalog HTTP/query; SQL real-HTTP-account-catalog-and-purchase | Có page999/sort/query; chưa có fixture12 sản phẩm và đủ 10/2 dòng cùng invalid sort cho ca này. |
| TC-CAT-03 | UC-05 | UC-05; REQ-PROD-02. | P2 | Một phần | MEM catalog HTTP; SEL03; JM02; ảnh search-empty | Có tìm tên, rỗng và không kết quả; chưa chứng minh tìm thương hiệu đúng fixture qua truy vấn DB thực. |
| TC-CAT-04 | UC-05 | UC-05; REQ-PROD-02. | P2 | Một phần | MEM catalog query/repository; PBT/FUZZ | Có 201/mảng và escape LIKE trong test; chưa đủ HTTP200 ký tự và sản phẩm chứa % thật. |
| TC-CAT-05 | UC-06 | UC-06; REQ-PROD-03, REQ-PROD-04. | P2 | Một phần | MEM catalog query/repository; ảnh lọc | Có xử lý lọc và giá nhỏ nhất; thiếu hai khoảng chính xác và tập ID DB ứng với TC. |
| TC-CAT-06 | UC-06 | UC-06; REQ-PROD-03. | P2 | Một phần | MEM catalog HTTP/query; PM04 | Có invalid query và min>max400; chưa đủ mọi dòng dữ liệu TC qua cùng phương pháp. |
| TC-CAT-07 | UC-07 | UC-07; REQ-PROD-01, REQ-PROD-04. | P2 | Một phần | MEM catalog detail; ảnh variant-black/white; JM03 | Có giá/kho/SKU theo biến thể và ảnh hai mức giá; chưa đối chiếu mọi kỳ vọng của TC bằng một log có ID dữ liệu. |
| TC-CAT-08 | UC-07 | UC-07; REQ-PROD-01. | P2 | Một phần | MEM catalog detail | Có ID lỗi400, không tồn tại404 và variant lạ; chưa chứng minh variant thuộc sản phẩm khác bằng DB fixture TC. |
| TC-CART-01 | UC-08 | UC-08; REQ-CART-01, REQ-ACCESS-01. | P1 | Một phần | PM01–02,08; SEL01; ảnh cart-empty/guest-cart-login | Có giỏ rỗng, guest redirect/401; cần ghép đủ kết quả/CSRF nếu TC yêu cầu, không suy từ ảnh đơn lẻ. |
| TC-CART-02 | UC-09 | UC-09; REQ-CART-02, REQ-CART-04, REQ-CART-05. | P1 | Một phần | MEM cart; SQL cart-CRUD-and-owner/cart-concurrent-add-unique; SEL04 | Có gộp dòng và thêm mới; fixture và các số lượng chưa chạy nguyên trạng toàn TC. |
| TC-CART-03 | UC-09 | UC-09; REQ-CART-02. | P1 | Một phần | MEM cart validation; WB; PM10; SQL HTTP-quantity-invalid-boundary-and-empty-cart | Có số lượng không hợp lệ và biên trong runner; chưa đối chiếu riêng từng giá trị 1/99 và toàn input sai TC qua HTTP. |
| TC-CART-04 | UC-09 | UC-09; REQ-CART-02, REQ-CART-05. | P1 | Một phần | MEM cart validation; SQL cart-CRUD-and-owner | Có từ chối vượt kho; thiếu hai lượt reset quantity4/stock5, thêm1 và thêm2 đúng TC. |
| TC-CART-05 | UC-09 | UC-09; REQ-CART-01, REQ-PRICE-01, REQ-ACCESS-01. | P1 | Một phần | MEM cart; SQL HTTP-owner-address-cart-order-and-spoofed-user; course1 C1-09 | Có bỏ qua giá/user_id giả; chưa đối chiếu toàn bộ qty2, hai giỏ và stock10 của TC. |
| TC-CART-06 | UC-10 | UC-10; REQ-CART-02, REQ-CART-03, REQ-ACCESS-01. | P1 | Một phần | SEL05; SQL cart-CRUD-and-owner; ảnh cart-qty2/3 | Có thay quantity và giữ sau reload; chưa đủ snapshot kho trước/sau của chính lượt UI2→3. |
| TC-CART-07 | UC-10 | UC-10; REQ-CART-02, REQ-CART-03, REQ-ACCESS-01. | P1 | Một phần | MEM cart ownership; SQL cart-CRUD-and-owner/HTTP-owner-address-cart-order-and-spoofed-user | Có chặn thao tác trái chủ sở hữu; cần tách đúng cập nhật quantity1, 404 và hai giỏ không đổi từ ca runner lớn. |
| TC-CART-08 | UC-11 | UC-11; REQ-CART-03, REQ-ACCESS-01. | P1 | Một phần | MEM cart CRUD; SQL cart-CRUD-and-owner; ảnh cart-delete | Có xóa và quyền; ảnh chỉ một lần xóa, chưa đủ cả B xóa/A xóa/gửi lặp và snapshot kho của TC. |
| TC-CART-09 | UC-08, UC-11 | UC-08, UC-11; REQ-CART-03, REQ-CART-04. | P2 | Một phần | MEM cart current price/stock | Có giữ dòng lỗi khi xem; chưa ảnh/thực thi UI xóa dòng hết kho và stock giữ0. |
| TC-ADDR-01 | UC-12 | UC-12; REQ-CHECKOUT-05. | P1 | Một phần | Ảnh checkout-default-address/checkout-second-address và cod-success; SQL shipping-price-and-snapshot | Có chọn mặc định, đổi địa chỉ và snapshot đơn; ảnh không chứng minh token mới gắn địa chỉ, cần log assertion riêng. |
| TC-ADDR-02 | UC-12 | UC-12; REQ-CHECKOUT-05, REQ-ACCESS-01. | P1 | Một phần | SQL price-change-foreign-address-and-empty; HTTP-owner-address-cart-order-and-spoofed-user; MEM checkout | Có chặn địa chỉ người khác; chưa gộp đủ ID không tồn tại và không lộ dữ liệu theo đúng TC. |
| TC-ADDR-03 | UC-12 | UC-12; REQ-CHECKOUT-05. | P2 | Một phần | MEM checkout thiếu địa chỉ | Service không tạo token khi thiếu địa chỉ đã có; thiếu HTTP/browser khẳng định nút đặt không khả dụng. |
| TC-PRICE-01 | UC-13 | UC-13; REQ-SHIP-01, REQ-PRICE-01, REQ-PRICE-02, REQ-PRICE-03. | P1 | Một phần | CUC shipping.feature dòng 299999.00 | Hàm báo giá đúng 329999.00, phí30000; thiếu xác nhận cùng dữ liệu trên trang HTTP. |
| TC-PRICE-02 | UC-13 | UC-13; REQ-SHIP-01, REQ-PRICE-01, REQ-PRICE-02, REQ-PRICE-03. | P1 | Một phần | CUC shipping.feature dòng300000.00; MEM checkout threshold | Hàm báo giá đúng miễn phí; thiếu xác nhận cùng dữ liệu trên trang HTTP. |
| TC-PRICE-03 | UC-13 | UC-13; REQ-SHIP-01, REQ-PRICE-01, REQ-PRICE-02, REQ-PRICE-03. | P1 | Một phần | CUC shipping.feature dòng300001.00 | Hàm báo giá đúng miễn phí; thiếu xác nhận cùng dữ liệu trên trang HTTP. |
| TC-PRICE-04 | UC-13 | UC-13; REQ-PRICE-01, REQ-PRICE-02. | P1 | Một phần | WB quote; CUC; course1 C1-04/07; SQL shipping-price-and-snapshot | Có nhiều dòng/phần lẻ ở mã nghiệp vụ; chưa nối toàn input của TC với trang HTTP. |
| TC-COD-01 | UC-13 | UC-13; REQ-CHECKOUT-03, REQ-CHECKOUT-04, REQ-DATA-01, REQ-CHECKOUT-06. | P1 | Một phần | MEM checkout chọn dòng; SQL real-HTTP-COD-commit-SQL-details-and-cart; ảnh cod-success | Có đơn COD và lưu snapshot/giữ dòng khác qua test; ảnh đơn409 là một dòng, không tự chứng minh đặt một phần giỏ. |
| TC-COD-02 | UC-13 | UC-13; REQ-CHECKOUT-01, REQ-CHECKOUT-02. | P1 | Một phần | MEM checkout HTTP; PM guest; SQL real-HTTP-account-catalog-and-purchase | Có guest và phương thức không hỗ trợ; cần phân biệt bank đang có ngoài phạm vi, không tự coi mọi bank request phải bị từ chối. |
| TC-COD-03 | UC-13 | UC-13; REQ-CHECKOUT-03, REQ-CART-02. | P1 | Một phần | SQL HTTP-quantity-invalid-boundary-and-empty-cart; price-change-foreign-address-and-empty; MEM checkout stale | Có giỏ rỗng, stock đổi và rollback; chưa ghép đúng các lượt TC/expected status. |
| TC-COD-04 | UC-13 | UC-13; REQ-CHECKOUT-03, REQ-ACCESS-01. | P1 | Một phần | MEM checkout selection; SQL HTTP-owner-address-cart-order-and-spoofed-user | Có ID sai/trái chủ sở hữu; chưa đối chiếu đủ từng dòng lựa chọn trong TC. |
| TC-COD-05 | UC-13 | UC-13; REQ-CHECKOUT-03. | P1 | Một phần | SQL HTTP-price-change-after-preview-reconfirm; MEM checkout stale | Có giá đổi409 và báo giá mới; fixture không trùng toàn TC, cần nhật ký truy vết từng bước nếu gán Pass. |
| TC-COD-06 | UC-13 | UC-13; REQ-CHECKOUT-03. | P1 | Một phần | MEM checkout token expiry; SQL HTTP-replay-after-success-and-12-parallel-same-token | Hết hạn 21phút được test ở service clock; gửi lặp sau thành công ở MySQL. Chưa kiểm tra cả hai bằng HTTP cùng protocol TC. |
| TC-COD-07 | UC-13 | UC-13; REQ-CHECKOUT-03, REQ-DATA-01. | P1 | Một phần | SQL HTTP-replay-after-success-and-12-parallel-same-token; MEM checkout concurrency | Có 12 request cùng token; cần đối chiếu chi tiết trạng thái từng request và toàn hậu điều kiện TC. |
| TC-COD-08 | UC-13 | UC-13; REQ-DATA-01. | P1 | Một phần | SQL HTTP-two-customers-last-stock-overlapping-InnoDB-5-rounds | Có 5 vòng chồng lấn transaction thật, một đơn thắng/kho không âm; là bằng chứng mạnh, chưa coi là lượt nguyên trạng của TC thiết kế. |
| TC-COD-09 | UC-13 | UC-13; REQ-CHECKOUT-04, REQ-DATA-02. | P1 | Một phần | SQL real-rollback-stock-second/order/item-second/clear/before-commit | Có fault injection và kiểm tra rollback thực tại nhiều điểm; cần ghi dòng dữ liệu tương ứng từng điểm TC, không coi ảnh terminal thay snapshot. |
| TC-COD-10 | UC-13 | UC-13; REQ-CHECKOUT-04, REQ-DATA-02. | P1 | Một phần | SQL HTTP-client-abort-after-real-commit-and-retry; real-commit-adapter-response-error-then-retry-refused | Có phân biệt commit thực và mất phản hồi; cần giữ hai trường hợp khác nhau, không gọi tất cả retry đều an toàn/thành công. |
| TC-ORDER-01 | UC-14 | UC-14; REQ-ORDER-01, REQ-ACCESS-01. | P1 | Một phần | SQL history-snapshots-after-edit-and-FK-SET-NULL; MEM orders snapshot; ảnh checkout | Có snapshot không đổi sau sửa/xóa liên quan; chưa thực thi nguyên trạng toàn TC. |
| TC-ORDER-02 | UC-14 | UC-14; REQ-ACCESS-01. | P1 | Một phần | MEM orders quyền404; SQL HTTP-owner-address-cart-order-and-spoofed-user | Có assertion không xem đơn người khác; cần gắn từng biến thể ID và đúng phương thức TC. |
| TC-ORDER-03 | UC-14 | UC-14; REQ-ORDER-01. | P2 | Một phần | MEM orders HTTP/query; SQL real-HTTP-account-catalog-and-purchase | Có rỗng/lọc/phân trang ở mock; thiếu đủ dữ liệu MySQL/UI của toàn TC. |
| TC-ADMIN-01 | UC-16, UC-17, UC-18 | UC-16, UC-17, UC-18; REQ-ADMIN-01, REQ-SEC-02. | P1 | Một phần | PM12; MEM admin-payments HTTP; MEM admin-orders HTTP FAIL; ảnh admin-denied | Kháchuser403 có thật. Test admin-orders dừng sớm trước một số assertion; không dùng test đó chứng minh phần POST/CSRF chưa chạy. |
| TC-ADMIN-02 | UC-16 | UC-16; REQ-ADMIN-01. | P2 | Một phần | MEM admin-orders test 15–16; HTTP test 22 FAIL | Service/repository tra cứu đạt; HTTP dừng ở câu đếm số đơn. Chưa gán Fail nghiệp vụ chỉ do assertion câu chữ. |
| TC-ADMIN-03 | UC-17 | UC-17; REQ-ADMIN-02. | P1 | Một phần | MEM admin-orders test 17; ảnh order-pending/confirmed/shipping/delivered-unpaid | Có trình tự UI và mock không đổi kho; ảnh không chứng minh kho trước/sau mỗi commit trên MySQL. |
| TC-ADMIN-04 | UC-17 | UC-17; REQ-ADMIN-02. | P1 | Một phần | MEM admin-orders test 17 | Service chặn bỏ/quay bước/confirm; chưa đủ HTTP+MySQL các lượt sai với dữ liệu độc lập. |
| TC-ADMIN-05 | UC-17 | UC-17; REQ-ORDER-03, REQ-DATA-02. | P1 | Một phần | CANCEL; MEM admin-orders test 18; ảnh cancel-before/after | MySQL đã hoàn stock2→4 cho qty2 một lần; ẩn nút không chứng minh gửi lại409. Đồng thời/lặp chỉ có mock. |
| TC-ADMIN-06 | UC-17 | UC-17; REQ-ADMIN-02, REQ-ADMIN-04. | P1 | Một phần | MEM admin-orders test 18,20 | Có expired boolean và trạng thái confirmed ở mock; chưa thử đúng 72h bằng clockDB và HTTP. |
| TC-CODPAY-01 | UC-18 | UC-18; REQ-ADMIN-03. | P1 | Một phần | MEM admin-payments test 23; ảnh order-delivered-unpaid/order-paid | Có UI thu COD thành công và mock request lặp; chưa xác minh lặp/tiền/kho bằng MySQL của lượt UI. |
| TC-CODPAY-02 | UC-18 | UC-18; REQ-ADMIN-03. | P1 | Một phần | MEM admin-payments test 24 | Có service từ chối trước giao/thiếuconfirm; thiếu lượt HTTP+MySQL nguyên trạng TC. |
| TC-AUTO-01 | AUTO-01 | AUTO-01; REQ-ORDER-04. | P1 | Một phần | AUTO; ảnh auto-before/after/control | Đã chạy tuổi 71h và 73h, chưa 71:59:59/72:00:00/72:00:01; scheduler thực chưa kiểm tra. |
| TC-AUTO-02 | AUTO-01 | AUTO-01; REQ-ORDER-03, REQ-ORDER-04. | P1 | Một phần | AUTO; MEM admin-orders test 20 | MySQL quét hai lần stock2→3→3 và đơn 71h giữpending. Chưa đủ tập đối chứng confirmed/shipping/delivered/cancelled trên DB thật. |
| TC-AUTO-03 | AUTO-01, UC-17 | AUTO-01, UC-17; REQ-ORDER-03, REQ-DATA-02. | P1 | Chưa có lượt đúng ca | MEM admin-orders test 18,20 | Tên test có chữ cạnh tranh nhưng mã test 20 chạy hai expireBatch; không chứng minh admin+AUTO chồng lấn InnoDB. Chưa có lượt đúng phương pháp TC. |
| TC-AUTO-04 | AUTO-01 | AUTO-01; REQ-ORDER-04. | P2 | Chưa có lượt đúng ca | Không có lượt tương ứng | Chưa có 51 đơn và hai batch 50+1/con trỏ; không lấy batch2đơn thay cho ca này. |
| TC-AUTO-05 | AUTO-01 | AUTO-01; REQ-DATA-02. | P1 | Một phần | MEM admin-orders test 19,20 | Có rollback hủy mock và tiếp tục batch; chưa lỗi hoàn biến thể thứ 2 qua AUTO transaction MySQL thật. |

## Quy ước nguồn

- **MEM**: [Minh-chung/Dot-02/memory-summary.txt](../Minh-chung/Dot-02/memory-summary.txt).
- **SQL**: [Minh-chung/Dot-02/mysql-results.json](../Minh-chung/Dot-02/mysql-results.json).
- **PM**: [11 - Kiểm thử HTTP với Postman.md](11%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20HTTP%20v%E1%BB%9Bi%20Postman.md).
- **SEL**: [Minh-chung/Selenium/run-2026-11-02T06-07-10-115Z/results.json](../Minh-chung/Selenium/run-2026-11-02T06-07-10-115Z/results.json).
- **WB**: [Minh-chung/Hop-trang/whitebox-run-01.tap](../Minh-chung/Hop-trang/whitebox-run-01.tap).
- **CUC**: [07 - Kiểm thử hành vi với Cucumber.md](07%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20h%C3%A0nh%20vi%20v%E1%BB%9Bi%20Cucumber.md).
- **PBT**: [Minh-chung/Tu-dong/run-2026-11-02T05-05-49-635Z/results.json](../Minh-chung/Tu-dong/run-2026-11-02T05-05-49-635Z/results.json).
- **MUT**: [Minh-chung/Mutation/techzone-mutation-Bft61B/results.json](../Minh-chung/Mutation/techzone-mutation-Bft61B/results.json).
- **CANCEL**: [Minh-chung/UI/cancel-result.json](../Minh-chung/UI/cancel-result.json).
- **AUTO**: [Minh-chung/UI/auto-result-1793562564259.json](../Minh-chung/UI/auto-result-1793562564259.json).
- **JM1**: [Jmeter/TechZone-JMeter-20261102-190049/1user.jtl](../Jmeter/TechZone-JMeter-20261102-190049/1user.jtl).
- **JM5**: [Jmeter/TechZone-JMeter-20261102-190049/5users.jtl](../Jmeter/TechZone-JMeter-20261102-190049/5users.jtl).

MEM test N là số `ok/not ok N` trong memory-summary.txt; các mô tả catalog/cart/checkout kèm file tests tương ứng trong website. SQL là tên scenario trong mysql-results.json. Ảnh ở Minh-chung/Doi-chieu, nguồn và SHA-256 trong manifest. PM/SEL/WB/CUC là bộ riêng, không cộng thành số ca thiết kế đã thực thi.

## Tổng kết đối chiếu

- Một phần: 55 ca.
- Chưa có lượt đúng ca: 3 ca.
- Sai khác: 1 ca.
- Chưa có cơ sở công bố tỷ lệ 59/59 hoặc tỷ lệ Pass toàn bộ SRS.
- Ưu tiên bổ sung theo rủi ro: AUTO biên/đồng thời/rollback/batch; cấu hình rate limit mặc định; kiểm tra HTTP+MySQL admin và COD; sau đó hoàn thiện dòng dữ liệu biên và log từng TC. Không bắt buộc chụp ảnh cho mỗi assertion nếu log có cấu trúc đã chứng minh được.

## Bổ sung ảnh từ ZIP

Đã thêm ảnh chi tiết đơn409 phía khách, giỏrỗng, terminalunit/MySQL/Selenium/Cucumber/mutation/coverage vàresponsivehai viewport vào hồ sơ; xem [kiểm kê74ảnh](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Ảnh bổ sung chưa chứng minh đầy đủ các hậu điều kiện còn thiếu của59ca, nên không tự đổi trạng thái toàn ca.
