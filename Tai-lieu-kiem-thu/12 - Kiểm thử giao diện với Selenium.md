# Kết quả kiểm thử trình duyệt bằng Selenium

## Mục tiêu và phạm vi

Thực hiện Lab 9 với sáu test riêng bằng Selenium WebDriver: đăng nhập đúng, đăng nhập sai, tìm kiếm, thêm giỏ, cập nhật số lượng và đăng xuất. Test thao tác điều khiển trên trang, có assertion và ảnh chụp thật từ WebDriver; không thay bằng request HTTP hoặc ảnh dựng từ log.

Website được kiểm tra là ứng dụng test riêng tại http://127.0.0.1:56327, kết nối techshop_test. Helper xác minh instance và quyền kết nối trước khi tạo fixture. Không sửa mã website hoặc cấu hình .env. Các thao tác giỏ chỉ dùng tài khoản nhân tạo mới cho từng test; không dùng tài khoản thủ công của người thực hiện.

## Môi trường

| Thành phần | Lần chạy đã ghi nhận |
| --- | --- |
| Node.js | v24.16.0 |
| Selenium WebDriver JS | 4.38.0 |
| Chrome | 156.0.8078.74 |
| ChromeDriver | 156.0.8078.47 |
| Chế độ | Headless, đối số kích thước cửa sổ 1366×900 |
| Timeout | Explicit wait tối đa 10 giây; page load 20 giây; implicit wait 0 |

Phiên bản mới nhất được registry báo khi khảo sát là Selenium 4.52.0, nhưng engines yêu cầu Node cao hơn bản 24.16 đang có. Vì vậy bộ công cụ ghim 4.38.0, hỗ trợ Node ≥20; không nâng runtime của website để cài bản mới nhất. Dependencies và package-lock nằm riêng trong Cong-cu/selenium.

Nguồn tham khảo: [Selenium first script](https://www.selenium.dev/documentation/webdriver/getting_started/first_script/). Phiên bản thực tế được ghi từ runtime và browser capabilities, không suy ra chỉ từ tên thư mục driver.

## Test và hậu điều kiện

| ID | Thao tác và assertion | Liên kết |
| --- | --- | --- |
| SEL-01 | Nhập đúng thông tin qua form; chờ tới /cart; kiểm tra thông báo giỏ trống | UC-02, UC-08 |
| SEL-02 | Nhập sai mật khẩu; kiểm tra thông báo chung và URL vẫn thuộc login | UC-02 |
| SEL-03 | Nhập từ khóa Tai nghe UI Test trong ô tìm, gửi bằng Enter; kiểm tra URL, có thẻ và các thẻ đều chứa tên mong đợi | UC-05 |
| SEL-04 | Đăng nhập, mở biến thể fixture1012, nhấn thêm giỏ; kiểm tra một dòng, quantity1, thành tiền100.000đ | UC-09 |
| SEL-05 | Chuẩn bị một dòng qua UI, nhấn tăng số lượng; đợi quantity2 và tiền200.000đ; tải lại trang rồi kiểm tra vẫn giữ | UC-10 |
| SEL-06 | Đăng nhập, nhấn Đăng xuất trên trang; mở lại /cart, kiểm tra chuyển login?returnTo=%2Fcart và không có cart-screen | UC-03, UC-08 |

Sáu test có phạm vi assertion cụ thể, không tự thay thế toàn bộ 59 ca nghiệp vụ. SEL-03 không chứng minh mọi cách tìm kiếm hoặc lọc đều đúng. Đợt này chưa tự động đặt COD, hủy đơn, thu COD hoặc AUTO-01 bằng Selenium.

## Fixture và dọn dữ liệu

- Mỗi test có xác thực tạo user riêng, tên bắt đầu SEL-ID; mật khẩu ngẫu nhiên chỉ giữ trong bộ nhớ, lưu database dưới dạng Argon2id.
- Mỗi test mở browser/profile mới. Không tái dùng cookie hoặc trạng thái test trước.
- Fixture sản phẩm được kiểm tra đúng ID, giá và kho trước khi chạy. Chỉ thêm/cập nhật giỏ, không đặt đơn nên kho không được giảm.
- Trong finally, đóng browser; xóa dòng giỏ và user đúng ID fixture trong transaction; kiểm tra user fixture không còn tồn tại.
- SEL-03 không tạo user nên cleanup=NOT_APPLICABLE. Năm test còn lại cleanup=PASS trong các lần đã ghi nhận.
- Kiểm tra tồn kho fixture trước/sau mỗi đợt bằng nhau. Đây không phải digest toàn database; không khẳng định mọi metadata hoặc AUTO_INCREMENT không đổi.

## Lịch sử chạy và xử lý độ ổn định

| Thư mục run trong Minh-chung/Selenium | Kết quả | Ghi nhận |
| --- | --- | --- |
| run-2026-11-02T06-02-22-758Z | 6/6 Pass | Lần đầu |
| run-2026-11-02T06-02-36-754Z | 5/6 Pass | SEL-02 gặp StaleElementReferenceError |
| run-2026-11-02T06-03-06-765Z | 6/6 Pass | Sau sửa đồng bộ trong mã test |
| run-2026-11-02T06-03-18-904Z | 6/6 Pass | Chạy lại xác nhận lần hai sau sửa |

Tên thư mục dùng UTC, cần quy đổi UTC+7 khi ghi giờ địa phương. Không cộng các đợt thành số test duy nhất; mỗi đợt chạy lại cùng sáu test.

Phân loại lần thất bại: lỗi đồng bộ của test trong lúc trang login được thay thế sau submit, chưa có căn cứ kết luận sai nghiệp vụ đăng nhập. Đã chỉnh helper login để giữ form cũ, chờ stalenessOf(form), sau đó chờ thông báo role=alert có nội dung đúng. Không tăng sleep tùy ý hoặc sửa website để che lỗi.

Sau chỉnh test, hai lần liên tiếp đều 6/6 Pass. Điều này là bằng chứng ổn định bước đầu trong môi trường hiện tại, không bảo đảm hết mọi flakiness ở mọi máy hoặc tải.

## Báo cáo và ảnh

Mỗi thư mục run có results.json, console.txt, report.html và ảnh SEL-01.png đến SEL-06.png. Ảnh được chụp từ browser headless sau assertion, hoặc khi thất bại; không phải ảnh người thực hiện thao tác thủ công. Chế độ headless vẫn dùng Chrome thật nhưng không có thanh địa chỉ của cửa sổ desktop trong PNG; URL và browser được ghi trong báo cáo.

Các ảnh không chứa mật khẩu rõ hoặc cookie/CSRF. Tên/tài khoản trong trang là dữ liệu nhân tạo. Report không lưu mật khẩu ngẫu nhiên; lỗi được lọc bỏ chuỗi mật khẩu/số điện thoại test khỏi message.

Không tuyên bố HTML report đã được kiểm tra mọi kích thước in; đây là báo cáo xem trên trình duyệt. Khi đưa vào Word/PDF chọn ảnh đại diện và giữ liên kết tới báo cáo đầy đủ.

## Chạy lại và minh chứng người thực hiện

Dependencies đã cài tại bộ công cụ riêng:

```powershell
node 'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/selenium/run.cjs'
```

Mặc định chạy headless. Người thực hiện muốn xem cửa sổ tự động thao tác có thể chọn rõ:

```powershell
$env:SELENIUM_VISIBLE='1'
try {
  node 'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/selenium/run.cjs'
} finally {
  Remove-Item Env:SELENIUM_VISIBLE
}
```

Không chạm vào cửa sổ browser do test tạo trong khi nó chạy. Nếu server/instance test đã dừng, dừng và báo lỗi môi trường, không đổi sang website chính. Máy mới phải npm ci --ignore-scripts trong thư mục công cụ, có Chrome/driver phù hợp và chuẩn bị lại fixture. Đường dẫn project/browser hiện theo máy này; cần điều chỉnh khi đóng gói bàn giao.

Ảnh người thực hiện cần chụp: Terminal có sáu dòng SEL-ID, SELENIUM_SUMMARY6/6 và stock unchanged=true. Lưu SEL-00-terminal.png trong Minh-chung/Selenium. Có thể chụp thêm trang report.html tổng kết. Không cần chụp tay sáu màn hình vì runner đã lưu ảnh thật cho từng test.

## Đoạn diễn giải báo cáo

“Em dùng Selenium điều khiển Chrome để chạy sáu kịch bản, mỗi test có browser và tài khoản riêng, assertion và cleanup. Lần chạy lại phát hiện một lỗi chờ phần tử của test; em thêm explicit wait theo việc form cũ bị thay thế. Sau đó hai lần liên tiếp đều đạt6/6. Phần này chứng minh các thao tác UI được chọn trên Chrome, chưa đại diện mọi trình duyệt hoặc toàn bộ website.”

## Ảnh bổ sung từ Screenshots.zip

Đã bổ sung ảnh người thực hiện vào nhóm minh chứng tương ứng. Tênảnh, nguồnZIP, nội dung vàgiới hạn được ghi tại [bảng kiểm kê](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Không tính ảnh như lượt thực thi mới; mutation phải đối chiếu đúng runID ghi trongảnh.
