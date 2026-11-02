# Kiểm thử nghiệp vụ bằng Cucumber và Gherkin

## Mục tiêu

Biểu diễn yêu cầu thành kịch bản Given/When/Then có assertion thực thi, áp dụng các kỹ thuật hộp đen đã thiết kế. Given xác lập dữ liệu ban đầu, When gọi hành động nghiệp vụ, Then đối chiếu kết quả mong đợi. ScenarioOutline mở rộng từng dòngExamples thành một scenario độc lập.

Mã step definition gọi hàm/service thật của TechZone. Các thao tác giỏ sử dụng repository thật với adapter database giả lập trong bộ nhớ từ tests/helpers/cart-database.cjs. Mỗi scenario được cấp fixture mới, không dùng trạng thái scenario trước. Không khởi tạo website, đăng nhập qua trình duyệt hoặc kết nối MySQL trong bộ này.

Nguồn hướng dẫn chính thức: [Cucumber installation](https://github.com/cucumber/cucumber-js/blob/main/docs/installation.md), [step definitions](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/step_definitions.md). Công cụ cài cục bộ trong bộ kiểm thử riêng thay vì cài global để dùng chung một instance Cucumber khi đăng ký/chạy các step.

## Môi trường và file

- Node.js v24.16.0; @cucumber/cucumber13.3.0, ghim phiên bản trong package.json và package-lock.json của Cong-cu/cucumber.
- Registry tại thời điểm chuẩn bị khai báo package hỗ trợNode22/24/>=26; Node24 của lần chạy phù hợp. Nếu đổi runtime cần đối chiếu lại package thực cài.
- Cài dependencies ngoài projectwebsite; không sửa package.json, lockfile, source hoặc.env của TechShop.
- Cong-cu/cucumber/features/shipping.feature: quy tắc phí vận chuyển không voucher.
- Cong-cu/cucumber/features/cart.feature: quản lý giỏ.
- Cong-cu/cucumber/features/step_definitions/business.cjs: fixture/hook và assertion.
- Cong-cu/cucumber/run.cjs: runner, tạo thư mục minh chứng riêng cho mỗi lần chạy.

## Danh sách scenario và truy vết

| Nhóm | Số scenario sau mở rộng | Yêu cầu và ca liên quan |
| --- | ---: | --- |
| Tiền hàng299.999/300.000/300.001, phí và tổng đúng | 3 | REQ-SHIP-01, REQ-PRICE-03; TC-PRICE-01/02/03 |
| Thêm cùng biến thể gộp một dòng, không trừ kho | 1 | REQ-CART-04/05; TC-CART-02 |
| Số lượng0,âm,thập phân,100 bị từ chối | 4 | REQ-CART-02; một phần TC-CART-03 |
| Tổng số lượng sau cộng vượt kho | 1 | REQ-CART-02; TC-CART-04 |
| Người khác không xóa được dòng của chủ sở hữu | 1 | REQ-ACCESS-01; một phần TC-CART-08 |
| Cập nhật thay thế, không cộng quantity cũ | 1 | REQ-CART-03; TC-CART-06 |
| Chủ sở hữu xóa dòng, không đổi kho | 1 | REQ-CART-03; một phần TC-CART-08 |
| Tổng | 12 | Không tự cộng thành12TC mới trong bảng59ca |

Đã gắn tagREQ/UC trong feature để hỗ trợ truy vết. Các scenario trên mô tả hành vi, không khẳng định đủ toàn bộSteps/fixture củaTCgốc. Ví dụ caquantity sai chưa thay thế các dòng biên hợp lệ1/99 trongTC-CART-03.

Feature dùng keywordEnglish và mô tả tiếngViệt không dấu để dễ chạy nhất quán trênTerminalWindows; không ảnh hưởng ý nghĩa nghiệp vụ. Khi diễn giải báo cáo có thể viết lại tên có dấu, giữ mã và liên kết tương ứng.

## Kết quả đã chạy

Lần thành công đầu lưu tại Minh-chung/Cucumber/run-2026-11-02T04-47-52-520Z. Tên thư mục là ISO UTC; không đọc trực tiếp phần giờ làm giờ địa phương. latest.json trỏ lần chạy gần nhất.

| Chỉ số từ Cucumber | Kết quả |
| --- | ---: |
| Scenario | 12 |
| Passed scenario | 12 |
| Step | 69 |
| Passed step | 69 |
| Failed/Undefined/Pending/Skipped step | 0 |

Đã đọc lại JSON, xác minh12scenario và69step đều cóstatuspassed. report.html được tạo thành công. Không đo coverage riêng cho đợtCucumber; không dùng bảngcoverageWB để gắn choCucumber.

Trong lúc cấu hình runner có lỗi đường dẫnCLI bịpackageexports chặn và lỗi dấu hai chấm trong đường dẫnWindows củaformatter. Đã chỉnh runner kiểm thử để đọcbin từmetadata và dùng đường dẫnreport tương đối. Đây là lỗi thiết lập công cụ trước khi thực thi scenario, không phải lỗi nghiệp vụ website. Các đợt lỗi và lần thành công được giữ riêng; số liệu ở trên chỉ thuộc lần chạy thành công.

## Chạy lại và chụp minh chứng

Sau khi dependencies đã được cài trên máy này:

```powershell
node 'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/cucumber/run.cjs'
```

Máy mới cần cài dependencies từlockfile, ngoài thư mụcwebsite:

```powershell
Set-Location -LiteralPath 'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/cucumber'
npm ci --ignore-scripts
npm test
```

Nếu project di chuyển, đặtTECHZONE_PROJECT về thư mụcTechShop trước khi chạy; không đưa secret vào biến này. Khi nộpGitHub cần sửa hướng dẫn đường dẫn theo cấu trúc bàn giao thực tế; không nộpnode_modules, dùngpackage-lock vànpmci để tái lập.

Ảnh cần chụp:

1. CUC-01-terminal.png: lệnh và tổng12scenarios/69steps đềupassed.
2. CUC-02-report.png: mởreport.html ở thư mục run đượcTerminalin ra, chụp tổng kết và một scenario cùng các bước. Nếu một ảnh không đủ, chụp tổng kết và phần chi tiết thành haiảnh.

Lưu trong Minh-chung/Cucumber. Các fileHTML/JSON/console được lưu theo từng đợt nên chạy lại không thay thế đợt cũ. Nếu kết quả thay đổi, giữ nguyên kết quả thật và điều tra. Không gửireport lên dịch vụpublish; runner chỉ xuất filelocal.

## Giới hạn và cách viết vào báo cáo

- Đây là kiểm thử hành vi thực thi trên hàm/service với fixture trong bộ nhớ, chưa phải nghiệm thu bởi khách hàng thật hoặc quy trìnhBDD có sự tham gia của các bên.
- Không chứng minh SQL, khóaInnoDB, trình duyệt, session/CSRF hoặcSelenium hoạt động. Các nội dung đó có bằng chứng riêng.
- Có phần hành vi trùngunit/integration đã chạy; giá trị bổ sung là cách biểu diễnGherkin và truy vết từ yêu cầu. Không cộng12scenario vào các bộ khác để tạo tỷ lệ bao phủ chung.
- Chưa có scenarioCucumber cho toàn17UC vàAUTO-01; không trình bày là bao phủ hết hệ thống.

Đoạn thuyết trình: “Em chuyển quy tắc phí vận chuyển và giỏ thànhGiven/When/Then. ScenarioOutline giúp chạy riêng các dữ liệu biên. Stepdefinition gọi mãnghiệpvụ thật, dùng fixture mới cho từngscenario. Kết quả12scenario,69stepđạt; vì database giảlập nên em tách bằngchứngMySQL và giao diện ở các phần khác.”

## Ảnh bổ sung từ Screenshots.zip

Đã bổ sung ảnh người thực hiện vào nhóm minh chứng tương ứng. Tênảnh, nguồnZIP, nội dung vàgiới hạn được ghi tại [bảng kiểm kê](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Không tính ảnh như lượt thực thi mới; mutation phải đối chiếu đúng runID ghi trongảnh.
