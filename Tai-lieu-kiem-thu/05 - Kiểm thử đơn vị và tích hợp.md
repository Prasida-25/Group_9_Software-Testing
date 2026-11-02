# Kết quả kiểm thử đợt 2 TechZone

Run MySQL: `2026-11-01T18-10-19-295Z-36f06107`. Thời điểm bắt đầu/kết thúc ISO UTC giữ trong file JSON; khi ghi giờ địa phương dùng UTC+7. Không đổi mã website, mã test hoặc Plan.docx trong đợt này.

## Phạm vi và số liệu thực tế

| Bộ chạy | Kết quả | Môi trường và giới hạn |
| --- | --- | --- |
| 9 file test có sẵn | 92/93 Pass, 1 Fail | Unit, repository giả lập và HTTP với fixture; có ca phụ ngoài phạm vi sâu |
| course1.test.js chạy riêng | 10/10 Pass | 7 unit và 3 tích hợp giả lập; đã nằm trong bộ 93 ở trên, không cộng thêm |
| check-purchase-mysql.cjs | 28/28 Pass | MySQL thật tách biệt; có kịch bản phụ hồ sơ/địa chỉ ngoài phạm vi sâu |

Các số trên là test/kịch bản của runner, không phải số ca trong bộ 59 test case đã thiết kế. Không cộng thành một tỷ lệ bao phủ yêu cầu và không tự gán toàn bộ 59 ca là Pass. Chưa đo coverage hoặc chứng minh mọi UC đều đã đạt.

## Môi trường và dữ liệu

- Trước khi chạy, helper xác minh instance, database và quyền tài khoản test. Đích là `techshop_test`, MySQL 8.0.46, InnoDB; không dùng database website.
- Runner tạo fixture riêng và dọn theo ID đã theo dõi sau từng kịch bản.
- 28 kịch bản đều có cleanup=PASS và oldDataUnchanged=true. So sánh digest dữ liệu trước/sau toàn bộ đợt đạt; không còn transaction InnoDB hoạt động tại kiểm tra cuối.
- Digest chứng minh các hàng dữ liệu ngoài fixture được giữ nguyên theo cách runner so sánh; không cam kết bộ đếm AUTO_INCREMENT hay mọi metadata database không đổi.
- Có fault injection chủ đích gây response lỗi; dòng `[HTTP] Có lỗi khi xử lý yêu cầu.` là một phần kịch bản, không tự coi cả đợt thất bại nếu các hậu điều kiện đã được assertion xác minh.

## Những hành vi đã có bằng chứng MySQL thật

| Nội dung | Kịch bản runner tiêu biểu | Quan hệ với bộ test case |
| --- | --- | --- |
| CRUD giỏ và quyền sở hữu | cart-CRUD-and-owner; cart-concurrent-add-unique | CART: có bằng chứng liên quan; cần đối chiếu đúng dữ liệu từng TC |
| Rollback trước commit | real-rollback-stock-second/order/item-second/clear/before-commit | TC-COD-09: cùng nhóm điểm lỗi, cần đối chiếu đầy đủ bước khi gán trạng thái |
| Tranh tồn kho | real-InnoDB-last-stock-race-5-rounds; HTTP-two-customers-last-stock-overlapping-InnoDB-5-rounds | TC-COD-08: có bằng chứng transaction chồng lấn và kiểm tra hậu điều kiện |
| Request lặp/đồng thời | duplicate-tokens-same-cart; HTTP-replay-after-success-and-12-parallel-same-token | TC-COD-06/07: bằng chứng liên quan, chưa thay thế phần token hết hạn |
| Mất phản hồi và commit chưa rõ | HTTP-client-abort-after-real-commit-and-retry; real-commit-adapter-response-error-then-retry-refused | TC-COD-10: kiểm tra trạng thái thực, không suy ra từ lỗi HTTP |
| Giá đổi và dữ liệu giả phía client | HTTP-frontend-total-low-high-ignored; HTTP-price-change-after-preview-reconfirm | TC-COD-05 và các yêu cầu giá server |
| Quyền sở hữu và snapshot | HTTP-owner-address-cart-order-and-spoofed-user; history-snapshots-after-edit-and-FK-SET-NULL | ADDR/ORDER: bằng chứng liên quan; cần liên kết từng assertion |

Tên/ID TC ở bảng chỉ là chỉ dẫn truy vết. Bộ thiết kế chưa được đánh dấu Pass trong đợt này vì fixture và một số tổ hợp tham số khác nhau. Hành vi hủy admin, AUTO-01 và thu COD hiện chủ yếu có test giả lập trong các file đã chạy; không tuyên bố đã chứng minh đồng thời của chúng trên MySQL thật từ runner mua hàng này.

## Vấn đề cần theo dõi

### TEST-ISSUE-001 — Assertion câu chữ quản trị đơn

Test tại `tests/admin-orders.test.js:110` vẫn Fail do mong đợi câu `2 đơn hàng phù hợp`; template không hiển thị câu đếm nhưng response có hai dòng đơn. Đây là vấn đề kỳ vọng test, chưa đủ căn cứ kết luận lỗi nghiệp vụ. Những bước sau assertion trong cùng test chưa chạy. Chưa sửa test hoặc giao diện.

### SPEC-GAP-001 — Giá từ trên thẻ sản phẩm

SRS REQ-PROD-04 và TC-CAT-01 yêu cầu hiển thị giá “từ” khi sản phẩm có nhiều mức giá. Đọc `src/views/catalog/partials/product-card.ejs` cho thấy thẻ chỉ render `formatMoney(product.min_price)`; test catalog hiện tại còn kiểm tra không có chữ `Từ`. Như vậy test hiện tại có thể Pass nhưng không chứng minh yêu cầu này đạt.

Phân loại: sai lệch giữa yêu cầu và triển khai, đã có bằng chứng đọc template/test; cần chụp trang sản phẩm có ít nhất hai mức giá trên ứng dụng test để xác nhận biểu hiện UI. Chưa tự sửa code hoặc hạ yêu cầu. Không khẳng định toàn bộ TC-CAT-01 đã được thực thi vì fixture của test có sẵn khác bộ thiết kế.

## Minh chứng đã lưu

- [Kết quả unit khóa 1](../Minh-chung/Dot-02/course1-console.txt)
- [Tóm tắt bộ test giả lập và HTTP](../Minh-chung/Dot-02/memory-summary.txt)
- [Console MySQL](../Minh-chung/Dot-02/mysql-console.txt)
- [Kết quả MySQL có cấu trúc và quan sát](../Minh-chung/Dot-02/mysql-results.json)

JSON xuất bản đã loại trường tên chứa password/secret/cookie/token/phone/CSRF/authVersion. Không đưa file cấu hình kết nối hoặc log HTML thô lên GitHub. Các ID trong quan sát là fixture test, không phải dữ liệu cửa hàng thật.

## Các bước chưa chạy trong đợt này

- Kiểm thử thủ công toàn bộ UI, Selenium, Postman collection, Lighthouse/responsive và JMeter.
- Chạy nguyên trạng từng dòng dữ liệu của bộ 59 ca và hoàn thiện bảng REQ → TC → lần chạy → minh chứng.
- MySQL thật cho admin hủy/thu COD và AUTO-01 khi chưa có harness tương ứng được xác minh.

Hướng dẫn ảnh người thực hiện cần chụp được tách tại `Huong-dan-chup-minh-chung.md`. Ảnh tự chụp phải phản ánh lần chạy của người thực hiện; không dùng ảnh dựng lại từ log làm ảnh màn hình thực thi.

## Ảnh bổ sung từ Screenshots.zip

Đã bổ sung ảnh người thực hiện vào nhóm minh chứng tương ứng. Tênảnh, nguồnZIP, nội dung vàgiới hạn được ghi tại [bảng kiểm kê](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Không tính ảnh như lượt thực thi mới; mutation phải đối chiếu đúng runID ghi trongảnh.
