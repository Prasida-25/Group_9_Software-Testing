# Chốt kết quả kiểm thử TechZone

Ngày chốt hồ sơ: 02/11/2026. Kết luận: các bộ kiểm thử đã lưu có kết quả như bảng dưới; bài chưa đủ căn cứ tuyên bố toàn bộ 59 ca hoặc toàn bộ yêu cầu đạt. Đợt này chỉ đối chiếu tài liệu/log/ảnh, không chạy lại test, không kết nối database hoặc sửa website.

## 1. Kết quả theo bộ chạy

| Bộ | Kết quả có bằng chứng | Phạm vi và lưu ý |
|---|---|---|
| Unit/mock/HTTP có sẵn | 92/93 đạt; 1 không đạt | MEM; có kiểm tra ngoài phạm vi sâu. course1 10/10 nằm trong 93, không cộng thêm |
| MySQL tích hợp/HTTP | 28/28 đạt, cleanup PASS | SQL; instance test riêng, không coi mock là InnoDB |
| Hộp trắng | 28/28 đạt | WB; line50%, branch93,48%, funcs61,54% của ba file chọn trong lượt này; không phải toàn backend |
| Mutation | Ban đầu 8/9; sau bổ sung test 9/9 | Chín mutant mục tiêu, không phải mọi loại lỗi |
| Cucumber | 12 scenario/69 step đạt theo report đã lưu | Fixture bộ nhớ; ba giá trị phí vận chuyển chính xác có trong feature |
| Sinh dữ liệu | 10/10 kiểm tra, 10.000 lượt | PBT/FUZZ, seed20261102; không phải fuzz toàn bộ HTTP |
| Postman | 14 request/26 assertion đạt theo ảnh và bảng kết quả | Không phải báo cáo Collection Runner; kiểm tra số assertion thực có |
| Selenium | Lượt cuối 6/6 đạt | results.json và sáu PNG tồn tại; giữ lịch sử lượt lỗi đồng bộ test |
| JMeter | 30/30 và150/150 response200/success=true | Hai tải nhẹ 1/5 threads, nghỉ1 giây/request; không phải tải tối đa |
| Lighthouse | 12 HTML đọc được, không runtimeError | Xem bảng riêng; không gán Pass hiệu năng do chưa có SLA |
| Responsive | Catalog 390×844: tìm/lọc được xác nhận | Chưa đủ kết quả riêng cho mọi viewport; detail/login ngoài phạm vi đã điều chỉnh |

Không cộng các hàng thành một tỷ lệ chung: đơn vị đếm, mức kiểm thử và hành vi trùng nhau. Chưa đo bao phủ toàn yêu cầu.

## 2. Kết quả JMeter đã xác minh

Đối chiếu 180 dòng JTL và statistics.json: hai mức lần lượt Average22,67/22,93ms; P9540,55/36,90ms; throughput1,01/3,97request/s; lỗi 0%. Chi tiết: [14 - Kiểm thử hiệu năng với JMeter.md](14%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20hi%E1%BB%87u%20n%C4%83ng%20v%E1%BB%9Bi%20JMeter.md).

## 3. Vấn đề và hạn chế phải công khai

| ID | Phân loại | Kết luận | Trạng thái |
|---|---|---|---|
| SPEC-GAP-001 | Sai khác yêu cầu/triển khai | Card nhiều mức giá thiếu chữ “từ”; ảnh danh sách và hai biến thể xác nhận biểu hiện; không phải sai phép tính giá | Mở, chưa sửa; đề xuất mức ảnh hưởng thấp, ưu tiênP2 |
| TEST-ISSUE-001 | Kỳ vọng kiểm thử | admin-orders HTTP Fail ở câu đếm 2 đơn; assertion phía sau chưa chạy; chưa đủ căn cứ gán lỗi nghiệp vụ | Mở, chưa sửa test |
| TEST-SETUP-JM-01 | Cấu hình kiểm thử | JM02 URISyntaxException do q chưa URL-encode; sửa trước hai lượt đo chính | Đã xử lý |
| TEST-SYNC-SEL-01 | Đồng bộ kiểm thử | Có lượt StaleElement; helper chờ đúng form/alert, các lượt sau đạt | Đã xử lý ở harness; không quy lỗi website |
| TEST-ORACLE-01 | Oracle sinh dữ liệu | Chuỗi toàn khoảng trắng bị normalize làm giả định test sai; đã chỉnh generator/oracle và lưu lịch sử | Đã xử lý |
| LIMIT-AUTO | Giới hạn bằng chứng | Test scoped71h/73h/quét lặp; chưa exact72h, scheduler thực, tranh admin/AUTO InnoDB hoặc batch51 | Chưa được chứng minh |
| LIMIT-LH | Giới hạn đo | M01catalog phiên chưa rõ, screen emulation disabled; dữ liệu fixture nhẹ/local | Giữ trong báo cáo |

## 4. Truy vết và minh chứng

- [Bảng đối chiếu59ca](15%20-%20%C4%90%E1%BB%91i%20chi%E1%BA%BFu%20ca%20ki%E1%BB%83m%20th%E1%BB%AD%20v%C3%A0%20minh%20ch%E1%BB%A9ng.md): 55 một phần; 3 chưa có lượt đúng ca; 1 sai khác. Đây là trạng thái đối chiếu, không phải tỷ lệ thực thi.
- [Lighthouse/responsive](13%20-%20Lighthouse%20v%C3%A0%20giao%20di%E1%BB%87n%20responsive.md): số liệu từng report, median và giới hạn.
- [Chỉ mục bằng chứng](../Minh-chung/Doi-chieu/evidence-index.json): đường dẫn/kích thước/SHA-256 các nguồn chính.
- [Ảnh người thực hiện](../Minh-chung/Doi-chieu/images-manifest.json): 31/31 ảnh nguồn tìm thấy và sao chép, ảnh gốc giữ nguyên.

## 5. Quyết định dùng cho báo cáo

Có thể viết chương kết quả từ các bộ đã có, giữ rõ mô hình mock/MySQL/browser và phạm vi assertion. Chưa kết luận hoàn thành mọi test case; các ca thiếu là kế hoạch bổ sung hoặc hạn chế được công khai. Không thay đổi đặc tả để biến kết quả hiện tại thành đạt. Nếu quyết định không chạy bổ sung, báo cáo phải giữ trạng thái và lý do thay vì ghi Pass.

Việc tiếp theo: người thực hiện xem bảng thiếu, ưu tiên hoàn thiện kiểm thử rủi ro cao nếu cần; đồng thời có thể viết báo cáo và sơ đồ từ kết quả đã xác minh. Chưa có yêu cầu sửa website, không tự sửa SPEC-GAP hoặc test kỳ vọng.


## Cập nhật sau kiểm kê Screenshots.zip

Đã đối chiếu 74 ảnh: 50 ảnh trùng bytes với hồ sơ trước đó, bổ sung 24 ảnh vào các nhóm minh chứng. Chi tiết [kiểm kê ZIP](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Có thêm ảnh responsive catalog 768×1024 và1366×768; chỉ chốt trạng thái giao diện quan sát được, không tự gán mọi thao tác Pass. Các số55một phần/3chưa có lượt đúng ca/1sai khác của59ca chưa thay đổi.

TEST-LINT-BASE-001: lần chạy lại05-05-49 trong ảnh người thực hiện có10/10kiểm tra sinh dữ liệu đạt nhưng ESLintbỏ qua5file vì outsideofbasepath. Lượt trước04-59-11 có0error/3warningregexthật; giữ tách biệt hai lượt. Không dùng ảnh lượt bỏ quafile làm bằng chứng lintthành công. Chưa sửa harness.
