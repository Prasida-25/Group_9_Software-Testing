# Kế hoạch và kết quả kiểm thử đợt 1 TechZone

Đợt này xác minh môi trường và chạy bộ test có sẵn làm mốc ban đầu. Không chỉnh sửa mã website hoặc mã test. Đây là tài liệu làm việc để đưa số liệu có minh chứng vào báo cáo, chưa thay thế toàn bộ Test Plan hoặc Test Report.

## Môi trường đã xác minh

| Thành phần | Ghi nhận |
| --- | --- |
| Bản mã | Commit `5cf5d42`; `git status --short` không có thay đổi khi bắt đầu |
| Node.js / npm | v24.16.0 / 11.13.0 |
| Database kiểm thử | `techshop_test`, MySQL 8.0.46, REPEATABLE-READ |
| Cách ly | Helper đã kiểm tra datadir và port khớp instance test, database và user khác cấu hình ứng dụng, quyền user test được giới hạn |
| Storage engine | 14 bảng được truy vấn metadata đều dùng InnoDB |
| Cho phép ghi | Người thực hiện đã đồng ý chỉ ghi môi trường test riêng |
| Thao tác thực tế đợt này | Khởi động lại instance test đã có; chỉ đọc metadata MySQL; các test chạy dùng fixture trong bộ nhớ |

Lần kiểm tra đầu chưa kết nối được môi trường test. Sau khi khởi động lại instance riêng, kiểm tra cách ly và metadata thành công. Không tạo lại database, không chạy dump và không ghi dữ liệu nghiệp vụ MySQL trong đợt này. Thông tin kết nối bí mật không đưa vào tài liệu.

## Chiến lược cho bước kiểm thử tiếp theo

1. Unit và tích hợp giả lập: kiểm tra tính tiền, đầu vào, sở hữu giỏ/đơn, điều phối checkout và quản trị bằng fixture mới cho mỗi test.
2. Tích hợp MySQL thật: xác minh SQL, rollback, khóa và tranh tồn kho trên instance test đã được kiểm tra cách ly. Chỉ dùng dữ liệu giả lập, lưu kết quả và kiểm tra việc dọn dữ liệu của từng ca.
3. HTTP/Postman: theo route thực tế, cookie phiên, CSRF và redirect; không mặc định có REST API JSON.
4. Selenium: tối thiểu 5 kịch bản giao diện trong phạm vi; lưu kết quả và ảnh phù hợp.
5. Lighthouse, responsive và JMeter: chốt cấu hình đo trước khi chạy; tải chỉ hướng vào môi trường test. Không lấy kết quả unit thay cho đánh giá hiệu năng hoặc trình duyệt.

Ưu tiên quyền sở hữu, tiền, tồn kho, đặt COD, hủy/hoàn kho và thu COD trước. Thêm/sửa địa chỉ, chuyển khoản, voucher và Mua ngay không trở thành phạm vi kiểm thử sâu chỉ vì có test sẵn cho chúng.

## Bộ test đã chạy

```powershell
node --test --test-reporter=tap tests/course1.test.js tests/cart.test.js tests/catalog.test.js tests/account.test.js tests/checkout.test.js tests/orders.test.js tests/admin-orders.test.js tests/admin-payments.test.js tests/purchase-flow.test.js
```

| Chỉ số từ Node test runner | Kết quả |
| --- | ---: |
| Tổng test, gồm test con | 93 |
| Pass | 92 |
| Fail | 1 |
| Cancelled / Skipped / Todo | 0 / 0 / 0 |

Số lượng này là đơn vị test của runner, không phải 93 test case nghiệp vụ đã thiết kế và truy vết. Một số file hiện có chứa ca phụ ngoài phạm vi sâu; cần tách khi tổng hợp kết quả cuối. Các test giả lập không chứng minh transaction/khóa hoạt động đúng trên InnoDB thật. Chưa đo coverage trong đợt này.

## Vấn đề TEST-ISSUE-001

- **Mô tả:** test HTTP quản trị đơn yêu cầu câu `2 đơn hàng phù hợp`, nhưng template hiện tại không hiển thị câu đếm này.
- **Vị trí:** `tests/admin-orders.test.js`, assertion tại dòng 110; template `src/views/admin/orders/index.ejs`.
- **Thực tế:** response HTTP 200 có hai dòng đơn #2 và #1, cùng phần phân trang; không có câu mà regex mong đợi.
- **Phân loại ban đầu:** vấn đề kỳ vọng của test cần đối chiếu yêu cầu. SRS không yêu cầu đúng câu đếm này; chưa có căn cứ kết luận lỗi nghiệp vụ quản lý đơn.
- **Tái hiện riêng:** chạy lệnh bên dưới, assertion này tiếp tục thất bại.
- **Ảnh hưởng:** test dừng tại assertion nên các bước phía sau trong cùng test, gồm xem chi tiết và POST chuyển/hủy, chưa được kiểm tra bởi lần thực thi đó. Không kết luận toàn bộ luồng này đã đạt chỉ dựa trên 92 test Pass khác.
- **Trạng thái:** chưa sửa. Có thể đề xuất kiểm tra số dòng và ID đơn thay cho câu chữ không thuộc yêu cầu; chỉ chỉnh mã test khi người thực hiện yêu cầu.

```powershell
node --test --test-name-pattern="Đơn admin HTTP" tests/admin-orders.test.js
```

## Minh chứng và cách dùng trong báo cáo

Log gốc hiện lưu ở thư mục tạm của máy:

- `C:/Users/Admin/AppData/Local/Temp/techzone-test-baseline.tap`
- `C:/Users/Admin/AppData/Local/Temp/techzone-admin-recheck.tap`

Log lỗi có thể chứa HTML đầy đủ. Phải rà và che cookie/token hoặc dữ liệu nhạy cảm trước khi đưa lên GitHub; nên công bố bản trích cần thiết. Không dùng thư mục tạm làm nơi lưu minh chứng cuối cùng.

Phần II báo cáo dùng chiến lược, môi trường và dữ liệu dự kiến; Phần III dùng kết quả thực thi cùng minh chứng; Phần IV nêu vấn đề, giới hạn và kết luận. README chỉ tóm tắt và liên kết.

## Việc cần làm ngay sau đợt này

1. Lập bảng test case có ID, REQ/UC, tiền điều kiện, dữ liệu cụ thể, bước làm và kết quả mong đợi; chưa gán Pass cho ca chưa truy vết.
2. Rà vấn đề TEST-ISSUE-001 và thống nhất cách sửa test nếu được yêu cầu; giữ nguyên giao diện hiện tại.
3. Chọn các ca MySQL thật trong phạm vi COD để kiểm tra đồng thời, rollback và snapshot; chưa ghi kết quả trước khi chạy.
4. Bổ sung ca cho các yêu cầu chưa được chứng minh, gồm AUTO-01 trên môi trường thích hợp, rồi chuyển sang HTTP và giao diện.

Plan.docx không bị sửa trong đợt này. Kết quả ở đây được giữ riêng để phân biệt kế hoạch với báo cáo thực thi.
