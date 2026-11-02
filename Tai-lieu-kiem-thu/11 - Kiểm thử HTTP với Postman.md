# Kết quả kiểm thử HTTP bằng Postman đợt 1

## Phạm vi và nguồn kết quả

Người thực hiện gửi lần lượt PM-01 đến PM-14 trong Postman Desktop, dùng environment TechZone isolated local test và URL http://127.0.0.1:56327. Kết quả dưới đây được đối chiếu từ 14 ảnh người thực hiện đã cung cấp trong chat và post-response scripts của collection; không phải kết quả Postman CLI/Newman hoặc Collection Runner.

Ngày minh chứng xác định được từ các ảnh Screenshot là 02/11/2026; một số ảnh clipboard không mang thời gian nên không suy đoán giờ gửi từng request. Chưa ghi nhận phiên bản Postman/Windows bằng minh chứng riêng. Cổng, ID và tài khoản fixture chỉ phục vụ môi trường local hiện tại.

Mục tiêu: kiểm tra response HTTP thực của ứng dụng server-rendered: status, redirect, nội dung HTML/JSON, cookie phiên, CSRF và quyền admin. Không gọi đây là kiểm thử một REST API JSON cho toànwebsite.

## Thống kê

| Chỉ số | Kết quả |
| --- | ---: |
| Request đã thực hiện và có ảnh | 14 |
| Request đạt các assertion đã viết | 14 |
| Request có assertion thất bại trên ảnh | 0 |
| Assertion tổng hợp từ ảnh và collection | 26 |
| Assertion Pass | 26 |
| Assertion Fail quan sát được | 0 |

14/14 là kết quả trong collection đợt 1, không phải tỷ lệ đạt toàn bộ 59 test case, 17 use case hoặc website. 26/26 là số kiểm tra cộng từ 14 response riêng lẻ; không phải một báo cáo Runner đã xuất. Mỗi pm.test có thể chứa nhiều biểu thức assertion; ở đây đếm theo kết quả pm.test hiển thị trên Postman, không đếm từng pm.expect.

## Bảng thực thi và minh chứng

| ID | Request thực tế | Status mong đợi / thực tế | Test Results | Kết quả | Minh chứng |
| --- | --- | --- | --- | --- | --- |
| PM-01 | GET `/cart` | 303 / 303 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-01-khach-redirect.png) |
| PM-02 | GET `/cart/preview` | 401 / 401 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-02-preview-401.png) |
| PM-03 | GET `/products?category_id=462` | 200 / 200 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-03-catalog-200.png) |
| PM-04 | GET `/products?min_price=200000&max_price=100000` | 400 / 400 | 1/1 | Pass | [Ảnh](../Minh-chung/Postman/PM-04-khoang-gia-sai-400.png) |
| PM-05 | GET `/login` | 200 / 200 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-05-login-co-CSRF.png) |
| PM-06 | POST `/login` | 401 / 401 | 3/3 | Pass | [Ảnh](../Minh-chung/Postman/PM-06-dang-nhap-sai.png) |
| PM-07 | POST `/login` | 303 / 303 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-07-dang-nhap-dung.png) |
| PM-08 | GET `/cart` | 200 / 200 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-08-gio-sau-login.png) |
| PM-09 | GET `/products/545` | 200 / 200 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-09-CSRF-phien-moi.png) |
| PM-10 | POST `/cart/items` | 422 / 422 | 1/1 | Pass | [Ảnh](../Minh-chung/Postman/PM-10-quantity-0.png) |
| PM-11 | POST `/cart/items` | 403 / 403 | 1/1 | Pass | [Ảnh](../Minh-chung/Postman/PM-11-thieu-CSRF.png) |
| PM-12 | GET `/admin/orders` | 403 / 403 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-12-tu-choi-admin.png) |
| PM-13 | POST `/logout` | 303 / 303 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-13-dang-xuat.png) |
| PM-14 | GET `/cart` | 303 / 303 | 2/2 | Pass | [Ảnh](../Minh-chung/Postman/PM-14-gio-sau-logout.png) |

## Phân tích kết quả

### Catalog và validation

PM-03 nhận 200 và kiểm tra HTML có hai tên sản phẩm fixture. PM-04 gửi min_price=200000 và max_price=100000, nhận 400 đúng mong đợi. Chỉ kiểm tra hai tên không chứng minh đầy đủ phân trang, sắp xếp, giá “từ” hoặc mọi bộ lọc đều đúng. Sai lệch giá “từ” đã phát hiện ở UI vẫn được theo dõi, không bị phủ định bởi PM-03 Pass.

### Xác thực và phiên

PM-01/02 chứng minh khách chưa đăng nhập bị chuyển về login khi mở giỏ HTML và nhận 401 ở preview JSON. PM-06 sai mật khẩu trả 401 với thông báo chung; PM-07 đúng thông tin trả 303 về /cart. PM-08 truy cập được trang giỏ trong phiên đã đăng nhập. PM-13 logout trả 303 về login; PM-14 mở giỏ sau đó bị chuyển đăng nhập.

Đợt này kiểm tra trạng thái truy cập sau đăng xuất qua cookie jar hiện tại. Chưa replay một bản cookie cũ được lưu riêng hoặc đăng xuất mọi thiết bị; không ghi kết luận vượt quá phạm vi này.

### CSRF và phân quyền

PM-05/09 xác nhận form có CSRF; script lưu token tự động. PM-11 gửi thiếu CSRF nhận 403. PM-12 dùng phiên khách vào /admin/orders nhận 403 và thông báo từ chối quyền admin. Chưa kiểm tra quyền sở hữu đơn A/B hoặc mọi POST từ những ca này.

PM-08 trong collection vẫn có tên “Mở giỏ và lấy CSRF phiên mới”, nhưng script hiện tại chỉ kiểm tra HTTP 200 và trang giỏ. CSRF phiên mới được lấy ở PM-09; không ghi PM-08 đã lấy token để khớp tên request.

### Status lỗi và kết quả test

Các status 400/401/403/422 ở tình huống đầu vào sai, thiếu xác thực hoặc thiếu quyền là kết quả mong đợi. Một HTTP 4xx không tự động làm test Fail; phải đối chiếu kỳ vọng của ca. HTTP 200 cũng không tự chứng minh chức năng đúng nếu chưa kiểm tra nội dung.

PM-10 và PM-11 mỗi request chỉ có một kiểm tra status. Ảnh không chứng minh không có tác động dữ liệu ngoài dự kiến; đợt tổng hợp này không chạy đối chiếu database bổ sung. Muốn kết luận giỏ, kho và đơn giữ nguyên cần snapshot trước/sau hoặc kiểm tra hậu điều kiện riêng.

## Cấu hình và tái lập

- Collection: Postman/TechZone-dot-01.postman_collection.json.
- Environment mẫu: Postman/TechZone-test.postman_environment.json; mật khẩu để trống, bản mẫu không chứa CSRF đang sử dụng.
- Chạy đúng thứ tự, tắt tự theo redirect để quan sát 303; cookie jar ban đầu chưa đăng nhập.
- Dùng tài khoản khách fixture 0900000021; mật khẩu chỉ nhập cục bộ, không đưa vào báo cáo hoặc Git.
- Gửi form x-www-form-urlencoded; script lấy CSRF từ HTML và lấy lại sau login.
- Khi đổi cổng, ID hoặc chuyển máy phải chuẩn bị đúng fixture và môi trường, không trỏ sang database website chính.

Xem [hướng dẫn Postman](../Postman/Huong-dan-Postman.md). Hướng dẫn ban đầu ghi Not Run phản ánh thời điểm chuẩn bị; bảng kết quả trong tài liệu này là nguồn trạng thái sau thực hiện.

## Đầu ra đã lưu

- 14 ảnh được sao chép từ file gốc người thực hiện cung cấp sang Minh-chung/Postman và đặt tên theo PM-ID. Nội dung ảnh không thay đổi.
- [Bảng CSV](../Minh-chung/Postman/postman-manual-results.csv): kết quả từng request để tổng hợp báo cáo.
- [Kết quả JSON](../Minh-chung/Postman/postman-manual-results.json): kết quả đối chiếu ảnh, đường dẫn minh chứng và SHA256; không phải export từ Postman Runner.
- Không tạo báo cáo Runner giả hoặc khẳng định đã chạy bằng Postman CLI. Không đọc giá trị mật khẩu, cookie hoặc token từ Postman.

## Giới hạn và công việc còn lại

Đợt 1 chưa có request đặt COD, xem đơn của người khác, hủy đơn, hoàn kho, thu COD lặp hoặc token checkout lặp. Các phần đó có minh chứng UI/MySQL riêng, không tự chuyển thành Pass Postman. Chưa chạy Collection Runner/Postman CLI hoặc đo hiệu năng; thời gian ms riêng lẻ trên ảnh không phải kết luận về khả năng chịu tải.

Nếu cần báo cáo tổng của công cụ, bước tiếp là chạy collection bằng Runner trên môi trường test và lưu kết quả thật. Không cần chụp lại từng request đã có ảnh chỉ để tăng minh chứng.

## Đoạn tóm tắt đưa vào báo cáo

“Đợt kiểm thử HTTP đầu tiên thực hiện bằng Postman gồm 14 request, kiểm tra trạng thái HTTP, chuyển hướng, nội dung response, phiên đăng nhập, CSRF và quyền quản trị. Qua 14 ảnh thực thi, 14 request đạt 26/26 kiểm tra đã viết. Các response 4xx trong ca tiêu cực là kết quả đúng mong đợi. Đợt này chưa bao phủ đặt/hủy đơn hoặc xác nhận thu COD bằng Postman; chưa có báo cáo Collection Runner.”
