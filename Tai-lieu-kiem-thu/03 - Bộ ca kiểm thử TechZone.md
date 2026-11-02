# Bộ test case TechZone

> Cập nhật đối chiếu 02/11/2026: xem [bảng truy vết hiện tại](15%20-%20%C4%90%E1%BB%91i%20chi%E1%BA%BFu%20ca%20ki%E1%BB%83m%20th%E1%BB%AD%20v%C3%A0%20minh%20ch%E1%BB%A9ng.md) và [bản chốt kết quả](16%20-%20T%E1%BB%95ng%20h%E1%BB%A3p%20k%E1%BA%BFt%20qu%E1%BA%A3%20ki%E1%BB%83m%20th%E1%BB%AD.md). Các trạng thái Not Run bên dưới là trạng thái của bản thiết kế ban đầu, không phải kết luận mới về mọi bộ test đã chạy.

Bản thiết kế để thực hiện sau SRS. Tất cả ca trong tài liệu này có trạng thái **Not Run**: chưa được đối chiếu từng ID với log chạy. Kết quả 92/93 test của đợt trước không được tự gán cho các ca mới này. Số ca không phải mục tiêu chất lượng; các giá trị tham số trong một ca cần tách lần chạy để truy vết.

## Quy ước và dữ liệu

- P1: quyền, tiền, kho, đơn và luồng chính; P2: trường hợp bổ sung. Đây là ưu tiên thực hiện, không phải mức nghiêm trọng lỗi.
- User A/B/admin, ID P/V/C/ADDR/O là bí danh fixture, không phải ID thật. Chỉ ghi ID thực khi chuẩn bị test; không lấy tài khoản hoặc đơn thật để chạy.
- Các mật khẩu và điện thoại trong tài liệu là dữ liệu giả lập dự kiến; không phải thông tin tài khoản đang vận hành. Chỉ tạo trong môi trường test.
- Mỗi ca và mỗi dòng tham số dùng trạng thái khởi đầu độc lập. Không để ca trước tiêu thụ kho, làm đổi trạng thái hoặc dùng hết rate limit của ca sau.
- Mọi POST hợp lệ phải có cookie phiên và CSRF tương ứng, trừ ca cố ý kiểm tra thiếu quyền/CSRF. Không công bố giá trị cookie, token hoặc bí mật.
- Database được phép: `techshop_test` trên instance tách biệt đã xác minh. Kiểm tra lại cách ly trước khi chạy; không đổi `.env` website để chạy test.
- Đọc giá/kho/địa chỉ và chủ sở hữu tại server. Các kiểm tra dữ liệu sau thao tác dùng kết nối test độc lập sau khi transaction đã kết thúc.
- Với ca dùng mock: snapshot/reset fixture trong bộ nhớ. Với MySQL: tạo fixture có dấu hiệu riêng, ghi ID; dọn đúng dữ liệu của ca theo thứ tự phụ thuộc sau khi lưu minh chứng; kiểm tra dữ liệu ngoài fixture không đổi. Không dùng dump chứa DROP để reset.
- Fault injection và đồng hồ điều khiển chỉ thuộc harness/adapter test. Nếu chưa có seam thích hợp thì đánh dấu **Blocked** kèm lý do, không tự sửa mã website hoặc sửa thời gian hệ điều hành.
- Cần ghi nhận lỗi mất kết nối/commit chưa rõ tách biệt với lỗi trước commit. Không suy ra không có đơn chỉ từ response thất bại.

## Cách thực hiện và ghi kết quả

1. Đọc yêu cầu/UC được liên kết và chuẩn bị đúng tiền điều kiện; ghi bản mã, môi trường và dữ liệu thực dùng.
2. Chạy từng bước, đối chiếu toàn bộ kết quả mong đợi. HTTP server và kiểm tra giao diện trình duyệt là các lượt khác nhau khi có validation phía client.
3. Ghi Run ID, TC ID, dòng tham số, kết quả thực tế, Pass/Fail/Blocked và đường dẫn minh chứng. Nếu assertion dừng giữa luồng, các bước chưa chạy không được ghi Pass.
4. Phân biệt lỗi sản phẩm, vấn đề test/fixture và vấn đề môi trường. Chỉ tạo Bug ID khi đã có đủ căn cứ.

Chưa đo coverage, chưa chạy Selenium/Postman/JMeter/Lighthouse trong bước thiết kế này. Những hạng mục đó có bộ test/cấu hình và kết quả riêng; tài liệu này tập trung nghiệp vụ sáu nhóm đã chốt và AUTO-01.

## Danh mục ca kiểm thử

| ID | UC | Tên ca | Ưu tiên | Trạng thái |
| --- | --- | --- | --- | --- |
| TC-AUTH-01 | UC-01 | Đăng ký thành công | P1 | Not Run |
| TC-AUTH-02 | UC-01 | Biên độ dài họ tên và mật khẩu | P2 | Not Run |
| TC-AUTH-03 | UC-01 | Trùng số điện thoại sau chuẩn hóa | P1 | Not Run |
| TC-AUTH-04 | UC-01 | Mật khẩu thiếu thành phần và xác nhận sai | P2 | Not Run |
| TC-AUTH-05 | UC-02 | Đăng nhập đúng và điều hướng theo vai trò | P1 | Not Run |
| TC-AUTH-06 | UC-02 | Đăng nhập sai và chống điều hướng ra ngoài | P1 | Not Run |
| TC-AUTH-07 | UC-02 | Giới hạn cặp IP và điện thoại | P2 | Not Run |
| TC-AUTH-08 | UC-02 | Giới hạn IP khi đổi số điện thoại | P2 | Not Run |
| TC-AUTH-09 | UC-03 | Đăng xuất và dùng lại cookie cũ | P1 | Not Run |
| TC-CAT-01 | UC-04 | Danh sách và giá từ | P2 | Not Run |
| TC-CAT-02 | UC-04 | Phân trang và sắp xếp | P2 | Not Run |
| TC-CAT-03 | UC-05 | Tìm tên và thương hiệu | P2 | Not Run |
| TC-CAT-04 | UC-05 | Biên và ký tự tìm kiếm | P2 | Not Run |
| TC-CAT-05 | UC-06 | Lọc theo giá nhỏ nhất và giá biên | P2 | Not Run |
| TC-CAT-06 | UC-06 | Từ chối bộ lọc sai | P2 | Not Run |
| TC-CAT-07 | UC-07 | Chi tiết và lựa chọn biến thể | P2 | Not Run |
| TC-CAT-08 | UC-07 | Chi tiết không tồn tại và biến thể thuộc sản phẩm khác | P2 | Not Run |
| TC-CART-01 | UC-08 | Giỏ rỗng và quyền truy cập | P1 | Not Run |
| TC-CART-02 | UC-09 | Thêm và gộp biến thể | P1 | Not Run |
| TC-CART-03 | UC-09 | Biên số lượng 1 và 99 | P1 | Not Run |
| TC-CART-04 | UC-09 | Vượt kho sau cộng | P1 | Not Run |
| TC-CART-05 | UC-09 | Giả mạo danh tính và giá | P1 | Not Run |
| TC-CART-06 | UC-10 | Cập nhật là thay thế số lượng | P1 | Not Run |
| TC-CART-07 | UC-10 | Không sửa dòng của người khác | P1 | Not Run |
| TC-CART-08 | UC-11 | Xóa dòng và gửi lại | P1 | Not Run |
| TC-CART-09 | UC-08, UC-11 | Dòng hết hàng vẫn xem và xóa được | P2 | Not Run |
| TC-ADDR-01 | UC-12 | Chọn địa chỉ mặc định và đổi địa chỉ | P1 | Not Run |
| TC-ADDR-02 | UC-12 | Địa chỉ người khác hoặc không tồn tại | P1 | Not Run |
| TC-ADDR-03 | UC-12 | Chưa có địa chỉ | P2 | Not Run |
| TC-PRICE-01 | UC-13 | Biên phí vận chuyển tiền hàng 299999.00 | P1 | Not Run |
| TC-PRICE-02 | UC-13 | Biên phí vận chuyển tiền hàng 300000.00 | P1 | Not Run |
| TC-PRICE-03 | UC-13 | Biên phí vận chuyển tiền hàng 300001.00 | P1 | Not Run |
| TC-PRICE-04 | UC-13 | Nhiều dòng và phần lẻ | P1 | Not Run |
| TC-COD-01 | UC-13 | Đặt thành công một phần giỏ | P1 | Not Run |
| TC-COD-02 | UC-13 | Chưa đăng nhập và sai phương thức | P1 | Not Run |
| TC-COD-03 | UC-13 | Giỏ rỗng hoặc hàng vừa hết kho | P1 | Not Run |
| TC-COD-04 | UC-13 | Dòng chọn sai và thuộc người khác | P1 | Not Run |
| TC-COD-05 | UC-13 | Giá thay đổi sau báo giá | P1 | Not Run |
| TC-COD-06 | UC-13 | Token hết hạn và gửi lặp sau thành công | P1 | Not Run |
| TC-COD-07 | UC-13 | Gửi đồng thời cùng token | P1 | Not Run |
| TC-COD-08 | UC-13 | Hai khách tranh sản phẩm cuối | P1 | Not Run |
| TC-COD-09 | UC-13 | Rollback lỗi trước commit | P1 | Not Run |
| TC-COD-10 | UC-13 | Mất response sau commit | P1 | Not Run |
| TC-ORDER-01 | UC-14 | Danh sách, chi tiết và lịch sử snapshot | P1 | Not Run |
| TC-ORDER-02 | UC-14 | Không xem đơn người khác | P1 | Not Run |
| TC-ORDER-03 | UC-14 | Lịch sử đơn rỗng, phân trang và lọc | P2 | Not Run |
| TC-ADMIN-01 | UC-16, UC-17, UC-18 | Quyền admin và CSRF | P1 | Not Run |
| TC-ADMIN-02 | UC-16 | Tra cứu đơn quản trị | P2 | Not Run |
| TC-ADMIN-03 | UC-17 | Chuyển đúng trình tự | P1 | Not Run |
| TC-ADMIN-04 | UC-17 | Từ chối bỏ bước, trạng thái cũ và thiếu xác nhận | P1 | Not Run |
| TC-ADMIN-05 | UC-17 | Hủy và hoàn kho đúng một lần | P1 | Not Run |
| TC-ADMIN-06 | UC-17 | Không hủy đơn đã xử lý và không xác nhận đơn hết hạn | P1 | Not Run |
| TC-CODPAY-01 | UC-18 | Thu COD và xác nhận lặp | P1 | Not Run |
| TC-CODPAY-02 | UC-18 | Từ chối thu trước giao và thiếu xác nhận | P1 | Not Run |
| TC-AUTO-01 | AUTO-01 | Biên 72 giờ | P1 | Not Run |
| TC-AUTO-02 | AUTO-01 | Không hủy nhầm và quét lặp | P1 | Not Run |
| TC-AUTO-03 | AUTO-01, UC-17 | Admin hủy đồng thời với tự hủy | P1 | Not Run |
| TC-AUTO-04 | AUTO-01 | Batch và con trỏ khi có nhiều đơn | P2 | Not Run |
| TC-AUTO-05 | AUTO-01 | Lỗi hoàn kho phải rollback toàn đơn | P1 | Not Run |

## Đặc tả chi tiết từng ca

### TC-AUTH-01 — Đăng ký thành công

**Liên kết:** UC-01; REQ-AUTH-01, REQ-AUTH-02, REQ-SEC-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Chưa đăng nhập; điện thoại fixture chưa tồn tại.

**Dữ liệu:** Tên Khách Test; điện thoại 0900000011; mật khẩu và xác nhận TestOnly123.

**Các bước:** Mở đăng ký; nhập dữ liệu; gửi form; tra cứu tài khoản test sau response.

**Kết quả mong đợi:** HTTP 303 tới /login?registered=1; tạo đúng một user, không tự đăng nhập; mật khẩu không lưu rõ, role=user.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTH-02 — Biên độ dài họ tên và mật khẩu

**Liên kết:** UC-01; REQ-AUTH-01.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Fixture mới cho từng dòng; CSRF hợp lệ.

**Dữ liệu:** Họ tên sau chuẩn hóa: 0,1,100,101 ký tự. Mật khẩu: 7,8,128,129 ký tự, luôn có chữ và số; xác nhận trùng.

**Các bước:** Giữ các trường khác hợp lệ; gửi riêng mỗi giá trị trực tiếp HTTP để không bị maxlength che lỗi server.

**Kết quả mong đợi:** Tên 1/100 và mật khẩu 8/128 được chấp nhận nếu trường khác hợp lệ; tên 0/101 hoặc mật khẩu 7/129 trả 422 và không tạo user. Mỗi giá trị là một lần chạy riêng.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTH-03 — Trùng số điện thoại sau chuẩn hóa

**Liên kết:** UC-01; REQ-AUTH-02.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** User fixture có số 0900000011.

**Dữ liệu:** Đăng ký lại với +84900000011; các trường khác hợp lệ.

**Các bước:** Gửi đăng ký; đếm tài khoản mang số đã chuẩn hóa trước và sau.

**Kết quả mong đợi:** HTTP 409; số tài khoản mang số đó không tăng; không thay tài khoản ban đầu.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTH-04 — Mật khẩu thiếu thành phần và xác nhận sai

**Liên kết:** UC-01; REQ-AUTH-01.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Chưa đăng nhập; mỗi lượt dùng số chưa tồn tại.

**Dữ liệu:** Lượt 1: abcdefgh; lượt 2: 12345678; lượt 3: TestOnly123 nhưng xác nhận TestOnly124.

**Các bước:** Gửi riêng ba dữ liệu; đọc lỗi form và kiểm tra không tạo tài khoản.

**Kết quả mong đợi:** Mỗi lượt HTTP 422; chỉ rõ lỗi phù hợp; mật khẩu không được điền lại trong HTML.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTH-05 — Đăng nhập đúng và điều hướng theo vai trò

**Liên kết:** UC-02; REQ-AUTH-03.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Có user A và admin fixture, chưa đăng nhập.

**Dữ liệu:** Thông tin đúng từng vai trò; returnTo=/cart với A.

**Các bước:** Đăng nhập A; kiểm tra đích; đăng xuất rồi đăng nhập admin.

**Kết quả mong đợi:** A được 303 về /cart; admin được 303 về /admin; tạo phiên hợp lệ, không lộ mật khẩu trong response.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTH-06 — Đăng nhập sai và chống điều hướng ra ngoài

**Liên kết:** UC-02; REQ-AUTH-03.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Phiên chưa đăng nhập; giới hạn request chưa bị dùng hết.

**Dữ liệu:** Số không tồn tại; mật khẩu sai của A; returnTo=https://example.com.

**Các bước:** Gửi riêng hai lỗi; sau đó đăng nhập đúng A với returnTo bên ngoài.

**Kết quả mong đợi:** Hai lỗi trả 401 cùng thông báo chung; không tạo phiên đã xác thực. Đăng nhập đúng không chuyển sang domain ngoài, dùng đích an toàn /.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTH-07 — Giới hạn cặp IP và điện thoại

**Liên kết:** UC-02; REQ-AUTH-03; LOGIN-R05–LOGIN-R07.

**Ưu tiên và cách kiểm tra:** P2; HTTP với đồng hồ kiểm soát.

**Tiền điều kiện:** Cấu hình mặc định pairMax=5, ipMax=30; kho rate limit mới, thời gian có kiểm soát.

**Dữ liệu:** Cùng IP và số hợp lệ; 5 lần mật khẩu sai rồi lần thứ 6.

**Các bước:** Gửi 5 lần sai; gửi lần 6, đọc status/Retry-After; tăng đồng hồ qua cửa sổ 15 phút và thử lại.

**Kết quả mong đợi:** 5 lần đầu 401; lần 6 bị 429 kèm Retry-After; hết cửa sổ được xử lý lại. Không mô tả thành khóa tài khoản vĩnh viễn hoặc 5 lần liên tiếp.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTH-08 — Giới hạn IP khi đổi số điện thoại

**Liên kết:** UC-02; REQ-AUTH-03; LOGIN-R05–LOGIN-R07.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Cấu hình mặc định; kho rate limit độc lập ca trước.

**Dữ liệu:** Cùng IP, 30 request sai với các số chuẩn hóa khác nhau, không số nào quá 5 lần.

**Các bước:** Gửi 30 request sai; gửi request thứ 31; ghi status.

**Kết quả mong đợi:** 30 request đầu được xử lý đăng nhập sai; request 31 bị 429 bởi giới hạn IP. Không dùng helper đã tăng hạn mức để chứng minh ca này.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTH-09 — Đăng xuất và dùng lại cookie cũ

**Liên kết:** UC-03; REQ-AUTH-04.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** A đã đăng nhập; lưu cookie cũ riêng trong bộ nhớ kiểm thử.

**Dữ liệu:** POST /logout và yêu cầu /orders với cookie cũ.

**Các bước:** Gửi logout có CSRF; kiểm tra chuyển trang; gọi trang bảo vệ bằng cookie trước logout.

**Kết quả mong đợi:** 303 tới /login?loggedout=1; phiên cũ không truy cập được /orders, được yêu cầu đăng nhập. Không công bố cookie trong minh chứng.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CAT-01 — Danh sách và giá từ

**Liên kết:** UC-04; REQ-PROD-01, REQ-PROD-04.

**Ưu tiên và cách kiểm tra:** P2; HTTP và trình duyệt.

**Tiền điều kiện:** Catalog test có P1: tên Tai nghe Test, brand Zone, V1 giá 100.000đ và V2 giá 200.000đ; P2: Chuột Test, brand Input, V3 giá 50.000đ; tất cả biến thể hợp lệ, khác SKU.

**Dữ liệu:** Mở /products không bộ lọc.

**Các bước:** Mở trang; tìm P1/P2; đối chiếu giá và số lần xuất hiện.

**Kết quả mong đợi:** P1 hiển thị giá từ 100.000đ vì hai mức giá; P2 giá 50.000đ; không nhân dòng sản phẩm theo số biến thể.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CAT-02 — Phân trang và sắp xếp

**Liên kết:** UC-04; REQ-PROD-01.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Catalog test có P1: tên Tai nghe Test, brand Zone, V1 giá 100.000đ và V2 giá 200.000đ; P2: Chuột Test, brand Input, V3 giá 50.000đ; tất cả biến thể hợp lệ, khác SKU. Có thêm fixture cho tổng 12 sản phẩm.

**Dữ liệu:** limit=10; page=1,2,999; sort=price_asc và sort=invalid.

**Các bước:** Mở từng truy vấn độc lập; đối chiếu ID và giá; ghi số dòng.

**Kết quả mong đợi:** Trang 1 có 10, trang 2 có 2; page=999 về trang 2. price_asc theo giá nhỏ nhất tăng dần; sort không hợp lệ trả 400.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CAT-03 — Tìm tên và thương hiệu

**Liên kết:** UC-05; REQ-PROD-02.

**Ưu tiên và cách kiểm tra:** P2; HTTP và trình duyệt.

**Tiền điều kiện:** Catalog test có P1: tên Tai nghe Test, brand Zone, V1 giá 100.000đ và V2 giá 200.000đ; P2: Chuột Test, brand Input, V3 giá 50.000đ; tất cả biến thể hợp lệ, khác SKU.

**Dữ liệu:** q=Tai nghe; q=Zone; q=zzz-khong-ton-tai; q rỗng.

**Các bước:** Tìm lần lượt; đối chiếu danh sách ID với fixture.

**Kết quả mong đợi:** Hai từ khóa đầu có P1; từ khóa không khớp cho danh sách rỗng; từ khóa rỗng không áp điều kiện tìm.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CAT-04 — Biên và ký tự tìm kiếm

**Liên kết:** UC-05; REQ-PROD-02.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Catalog test có P1: tên Tai nghe Test, brand Zone, V1 giá 100.000đ và V2 giá 200.000đ; P2: Chuột Test, brand Input, V3 giá 50.000đ; tất cả biến thể hợp lệ, khác SKU. Có một sản phẩm tên chứa ký tự % thật.

**Dữ liệu:** q dài 200/201 ký tự; q=%; q được gửi thành mảng.

**Các bước:** Gửi riêng mỗi truy vấn; kiểm tra status và tập sản phẩm.

**Kết quả mong đợi:** 200 ký tự được nhận; 201 hoặc q dạng mảng trả 400; % chỉ khớp ký tự thật, không khớp tất cả do wildcard.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CAT-05 — Lọc theo giá nhỏ nhất và giá biên

**Liên kết:** UC-06; REQ-PROD-03, REQ-PROD-04.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Catalog test có P1: tên Tai nghe Test, brand Zone, V1 giá 100.000đ và V2 giá 200.000đ; P2: Chuột Test, brand Input, V3 giá 50.000đ; tất cả biến thể hợp lệ, khác SKU.

**Dữ liệu:** min_price=100000,max_price=100000; sau đó 150000–250000.

**Các bước:** Gửi hai khoảng độc lập; đối chiếu P1.

**Kết quả mong đợi:** Khoảng đầu có P1 vì giá nhỏ nhất bằng 100.000đ; khoảng sau loại P1 dù V2 có giá 200.000đ.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CAT-06 — Từ chối bộ lọc sai

**Liên kết:** UC-06; REQ-PROD-03.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Catalog test có P1: tên Tai nghe Test, brand Zone, V1 giá 100.000đ và V2 giá 200.000đ; P2: Chuột Test, brand Input, V3 giá 50.000đ; tất cả biến thể hợp lệ, khác SKU.

**Dữ liệu:** min=200000,max=100000; min=-1; category_id không tồn tại.

**Các bước:** Gửi từng bộ sai, giữ tham số còn lại hợp lệ.

**Kết quả mong đợi:** Mỗi bộ trả 400; không tự hoán đổi cận hoặc bỏ qua danh mục sai để trả danh sách chung.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CAT-07 — Chi tiết và lựa chọn biến thể

**Liên kết:** UC-07; REQ-PROD-01, REQ-PROD-04.

**Ưu tiên và cách kiểm tra:** P2; HTTP và trình duyệt.

**Tiền điều kiện:** Catalog test có P1: tên Tai nghe Test, brand Zone, V1 giá 100.000đ và V2 giá 200.000đ; P2: Chuột Test, brand Input, V3 giá 50.000đ; tất cả biến thể hợp lệ, khác SKU. V1 stock=0, V2 stock=5.

**Dữ liệu:** Mở P1 không variant; sau đó chọn V1 và V2.

**Các bước:** Mở chi tiết; kiểm tra mặc định; lần lượt chọn biến thể và đối chiếu ID/giá/kho.

**Kết quả mong đợi:** Mặc định V2 còn hàng; khi chọn rõ V1/V2, dữ liệu hiển thị thuộc đúng biến thể; xem trang chưa đổi kho hay giỏ.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CAT-08 — Chi tiết không tồn tại và biến thể thuộc sản phẩm khác

**Liên kết:** UC-07; REQ-PROD-01.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Catalog test có P1: tên Tai nghe Test, brand Zone, V1 giá 100.000đ và V2 giá 200.000đ; P2: Chuột Test, brand Input, V3 giá 50.000đ; tất cả biến thể hợp lệ, khác SKU.

**Dữ liệu:** product_id=bad; ID sản phẩm không tồn tại; P1 với variant=V3.

**Các bước:** Mở ba URL riêng.

**Kết quả mong đợi:** Mã sản phẩm sai định dạng 400; ID đúng định dạng không có 404; V3 không thuộc P1 trả 400.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-01 — Giỏ rỗng và quyền truy cập

**Liên kết:** UC-08; REQ-CART-01, REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** A/B có phiên riêng, A có một dòng, B giỏ rỗng.

**Dữ liệu:** GET /cart bằng khách, A và B.

**Các bước:** Mở giỏ ở ba phiên; đối chiếu ID dòng và tổng.

**Kết quả mong đợi:** Khách 303 đi đăng nhập; A thấy đúng dòng mình; B thấy giỏ rỗng và không thấy dòng A.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-02 — Thêm và gộp biến thể

**Liên kết:** UC-09; REQ-CART-02, REQ-CART-04, REQ-CART-05.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** A giỏ rỗng; V1 giá 100.000đ, stock=10.

**Dữ liệu:** Thêm V1 quantity=2 rồi quantity=3.

**Các bước:** Ghi stock trước; gửi hai yêu cầu thêm; đọc giỏ và stock sau.

**Kết quả mong đợi:** Chỉ một dòng V1, quantity=5, tiền hàng 500.000đ; stock vẫn 10.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-03 — Biên số lượng 1 và 99

**Liên kết:** UC-09; REQ-CART-02.

**Ưu tiên và cách kiểm tra:** P1; HTTP.

**Tiền điều kiện:** Mỗi lượt dùng fixture mới, V1 stock=100.

**Dữ liệu:** quantity=1 và 99; lượt riêng 0,-1,1.5,100, rỗng.

**Các bước:** Gửi từng giá trị độc lập trực tiếp HTTP; đọc giỏ sau mỗi lượt.

**Kết quả mong đợi:** 1/99 được chấp nhận; các giá trị sai trả 422, không thêm dòng.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-04 — Vượt kho sau cộng

**Liên kết:** UC-09; REQ-CART-02, REQ-CART-05.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** A có V1 quantity=4; V1 stock=5.

**Dữ liệu:** Thêm 1; lượt độc lập khác thêm 2 từ trạng thái quantity=4.

**Các bước:** Gửi lần lượt với reset fixture giữa hai lượt.

**Kết quả mong đợi:** Thêm 1 thành 5; thêm 2 bị 422, quantity giữ 4 và kho giữ 5.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-05 — Giả mạo danh tính và giá

**Liên kết:** UC-09; REQ-CART-01, REQ-PRICE-01, REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** A đăng nhập; B giỏ rỗng; V1 giá 100.000đ, stock=10.

**Dữ liệu:** POST thêm quantity=2, thêm user_id=B, price=1, total=2.

**Các bước:** Gửi bằng phiên A; đọc giỏ A và B, stock V1.

**Kết quả mong đợi:** Giỏ A thêm hai sản phẩm giá nguồn server; B không đổi; giá giả không có hiệu lực; kho không đổi.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-06 — Cập nhật là thay thế số lượng

**Liên kết:** UC-10; REQ-CART-02, REQ-CART-03, REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** A có dòng V1 quantity=2, stock=10.

**Dữ liệu:** Cập nhật quantity=3.

**Các bước:** Gửi cập nhật; đọc lại dòng và kho.

**Kết quả mong đợi:** Quantity=3, không phải 5; thành tiền theo giá server; stock=10.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-07 — Không sửa dòng của người khác

**Liên kết:** UC-10; REQ-CART-02, REQ-CART-03, REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Dòng CART-A thuộc A; dùng phiên B.

**Dữ liệu:** Cập nhật CART-A quantity=1.

**Các bước:** Chụp dữ liệu dòng trước; gửi bằng B; đọc lại.

**Kết quả mong đợi:** 404; dòng A và giỏ B giữ nguyên.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-08 — Xóa dòng và gửi lại

**Liên kết:** UC-11; REQ-CART-03, REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** A có hai dòng V1/V2; B phiên riêng.

**Dữ liệu:** B xóa dòng A; A xóa dòng V1; A gửi lại cùng ID.

**Các bước:** Thực hiện theo thứ tự; kiểm tra giỏ và kho sau mỗi bước.

**Kết quả mong đợi:** B nhận 404; A xóa thành công, giữ V2 và không đổi kho; lần xóa lặp 404.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CART-09 — Dòng hết hàng vẫn xem và xóa được

**Liên kết:** UC-08, UC-11; REQ-CART-03, REQ-CART-04.

**Ưu tiên và cách kiểm tra:** P2; HTTP và trình duyệt.

**Tiền điều kiện:** A có một dòng V1 quantity=1 nhưng stock đã về 0 trên fixture test.

**Dữ liệu:** Mở giỏ rồi xóa dòng.

**Các bước:** Đọc giỏ; kiểm tra cảnh báo; gửi xóa.

**Kết quả mong đợi:** Hiển thị cảnh báo hết hàng, không tự xóa khi xem; chủ giỏ vẫn xóa được, stock giữ 0.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADDR-01 — Chọn địa chỉ mặc định và đổi địa chỉ

**Liên kết:** UC-12; REQ-CHECKOUT-05.

**Ưu tiên và cách kiểm tra:** P1; HTTP và trình duyệt.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca. A có hai địa chỉ hợp lệ, một mặc định.

**Dữ liệu:** ADDR-A mặc định và ADDR-A2.

**Các bước:** Mở checkout; kiểm tra địa chỉ được chọn; đổi sang A2 và áp dụng.

**Kết quả mong đợi:** Ban đầu chọn địa chỉ mặc định; sau áp dụng hiển thị đúng A2; báo giá/token tương ứng lựa chọn mới.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADDR-02 — Địa chỉ người khác hoặc không tồn tại

**Liên kết:** UC-12; REQ-CHECKOUT-05, REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** address_id=ADDR-B thuộc B; lượt khác ID không tồn tại.

**Các bước:** Mở checkout/gửi chọn địa chỉ bằng phiên A với từng ID.

**Kết quả mong đợi:** 409; không cho đặt bằng địa chỉ đó; không lộ chi tiết địa chỉ B.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADDR-03 — Chưa có địa chỉ

**Liên kết:** UC-12; REQ-CHECKOUT-05.

**Ưu tiên và cách kiểm tra:** P2; HTTP và trình duyệt.

**Tiền điều kiện:** A đã đăng nhập, giỏ hợp lệ nhưng không có địa chỉ lưu.

**Dữ liệu:** GET checkout.

**Các bước:** Mở checkout; kiểm tra thông báo, nút đặt và token.

**Kết quả mong đợi:** Thông báo cần địa chỉ; không có token báo giá đặt hợp lệ và không có nút đặt khả dụng. Không kiểm thử CRUD địa chỉ.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-PRICE-01 — Biên phí vận chuyển tiền hàng 299999.00

**Liên kết:** UC-13; REQ-SHIP-01, REQ-PRICE-01, REQ-PRICE-02, REQ-PRICE-03.

**Ưu tiên và cách kiểm tra:** P1; Unit, sau đó HTTP.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** Một dòng quantity=1, unit_price=299999.00; kho ≥1.

**Các bước:** Tạo báo giá bằng dữ liệu fixture; đối chiếu subtotal, shipping và total ở server và trang.

**Kết quả mong đợi:** Subtotal=299999.00; shipping=30000.00; total=329999.00. Không áp voucher.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-PRICE-02 — Biên phí vận chuyển tiền hàng 300000.00

**Liên kết:** UC-13; REQ-SHIP-01, REQ-PRICE-01, REQ-PRICE-02, REQ-PRICE-03.

**Ưu tiên và cách kiểm tra:** P1; Unit, sau đó HTTP.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** Một dòng quantity=1, unit_price=300000.00; kho ≥1.

**Các bước:** Tạo báo giá bằng dữ liệu fixture; đối chiếu subtotal, shipping và total ở server và trang.

**Kết quả mong đợi:** Subtotal=300000.00; shipping=0.00; total=300000.00. Không áp voucher.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-PRICE-03 — Biên phí vận chuyển tiền hàng 300001.00

**Liên kết:** UC-13; REQ-SHIP-01, REQ-PRICE-01, REQ-PRICE-02, REQ-PRICE-03.

**Ưu tiên và cách kiểm tra:** P1; Unit, sau đó HTTP.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** Một dòng quantity=1, unit_price=300001.00; kho ≥1.

**Các bước:** Tạo báo giá bằng dữ liệu fixture; đối chiếu subtotal, shipping và total ở server và trang.

**Kết quả mong đợi:** Subtotal=300001.00; shipping=0.00; total=300001.00. Không áp voucher.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-PRICE-04 — Nhiều dòng và phần lẻ

**Liên kết:** UC-13; REQ-PRICE-01, REQ-PRICE-02.

**Ưu tiên và cách kiểm tra:** P1; Unit.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** V1 giá 100000.01 quantity=3; kho=5.

**Các bước:** Lấy báo giá; đối chiếu phép nhân bằng số thập phân chính xác.

**Kết quả mong đợi:** Subtotal=300000.03, phí=0.00, total=300000.03; không mất phần lẻ do số thực.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-01 — Đặt thành công một phần giỏ

**Liên kết:** UC-13; REQ-CHECKOUT-03, REQ-CHECKOUT-04, REQ-DATA-01, REQ-CHECKOUT-06.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca. Có hai dòng: C1=V1 quantity2 giá100.000đ, C2=V2 quantity1; V1 stock10.

**Dữ liệu:** Chọn chỉ C1, ADDR-A, COD.

**Các bước:** Ghi mốc kho/giỏ/đơn; mở báo giá; gửi đặt hợp lệ; đọc đơn/chi tiết/giỏ/kho sau commit.

**Kết quả mong đợi:** Tạo đúng một đơn pending/unpaid, tổng230.000đ; chi tiết V1 qty2; kho V1=8; C1 bị xóa, C2 giữ nguyên; redirect303 tới thành công.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-02 — Chưa đăng nhập và sai phương thức

**Liên kết:** UC-13; REQ-CHECKOUT-01, REQ-CHECKOUT-02.

**Ưu tiên và cách kiểm tra:** P1; HTTP.

**Tiền điều kiện:** Phiên khách chưa đăng nhập; lượt độc lập A có giỏ và địa chỉ hợp lệ.

**Dữ liệu:** Khách mở checkout; A gửi phương thức không được hỗ trợ.

**Các bước:** Gửi từng tình huống với CSRF/phiên tương ứng; đếm đơn trước sau.

**Kết quả mong đợi:** Khách phải đăng nhập; phương thức không hỗ trợ bị từ chối và không tạo đơn. Không dùng bank để kiểm thử sâu; mã HTTP sai phương thức đối chiếu route khi thực thi.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-03 — Giỏ rỗng hoặc hàng vừa hết kho

**Liên kết:** UC-13; REQ-CHECKOUT-03, REQ-CART-02.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** Lượt1 không dòng; lượt2 giỏ qty2 nhưng kho chỉ1.

**Các bước:** Mở checkout từng fixture; kiểm tra phản hồi và dữ liệu.

**Kết quả mong đợi:** Không có báo giá đặt hợp lệ; 409 cho điều kiện giỏ/stock; không tạo đơn hoặc trừ kho.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-04 — Dòng chọn sai và thuộc người khác

**Liên kết:** UC-13; REQ-CHECKOUT-03, REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** items chứa ID lặp; lượt khác chứa dòng B hợp lệ.

**Các bước:** Mở checkout với từng danh sách.

**Kết quả mong đợi:** ID lặp trả400; ID dòng B không thuộc giỏ A trả409; không tạo đơn và không lộ giỏ B.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-05 — Giá thay đổi sau báo giá

**Liên kết:** UC-13; REQ-CHECKOUT-03.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca. V1 giá100.000đ qty1 stock10.

**Dữ liệu:** Sau khi có token, đổi giá fixture thành110.000đ.

**Các bước:** Lấy báo giá; thay giá trong môi trường test; gửi đặt bằng báo giá cũ; kiểm tra đơn/kho/giỏ.

**Kết quả mong đợi:** 409 yêu cầu xác nhận lại; không âm thầm đặt giá mới; không tạo đơn hoặc xóa giỏ từ request bị từ chối.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-06 — Token hết hạn và gửi lặp sau thành công

**Liên kết:** UC-13; REQ-CHECKOUT-03.

**Ưu tiên và cách kiểm tra:** P1; HTTP có đồng hồ kiểm soát.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** Hai lượt độc lập: token quá20 phút; token đã đặt thành công.

**Các bước:** Dùng đồng hồ kiểm soát để làm hết hạn lượt1; lượt2 đặt thành công rồi gửi lại cùng token.

**Kết quả mong đợi:** Hết hạn trả409, không tạo đơn. Gửi lại token đã done trả cùng order, không tạo đơn/trừ kho lần nữa.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-07 — Gửi đồng thời cùng token

**Liên kết:** UC-13; REQ-CHECKOUT-03, REQ-DATA-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca. Một dòng qty1, stock5.

**Dữ liệu:** 12 request song song cùng token còn hạn.

**Các bước:** Đặt barrier cho request; gửi đồng thời; đợi tất cả hoàn tất; đọc đơn/kho/giỏ.

**Kết quả mong đợi:** Chỉ một đơn, kho còn4; request đang pending có thể409, request thấy done có thể về cùng đơn. Không yêu cầu cả12 đều nhận cùng status.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-08 — Hai khách tranh sản phẩm cuối

**Liên kết:** UC-13; REQ-DATA-01.

**Ưu tiên và cách kiểm tra:** P1; MySQL thật, transaction chồng lấn.

**Tiền điều kiện:** A/B mỗi người giỏ qty1 và địa chỉ riêng; cùng V1 stock1; cả hai có báo giá.

**Dữ liệu:** Hai request đặt khác token, khác phiên.

**Các bước:** Đồng bộ cho hai transaction chồng lấn; đặt đồng thời; đọc đơn và kho sau kết thúc.

**Kết quả mong đợi:** Chỉ một đơn thành công, kho0; người thua không có đơn và giữ dòng chưa đặt; không bán2 khi tồn1.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-09 — Rollback lỗi trước commit

**Liên kết:** UC-13; REQ-CHECKOUT-04, REQ-DATA-02.

**Ưu tiên và cách kiểm tra:** P1; MySQL test với adapter fault injection.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca. Hai dòng hợp lệ; ghi snapshot bảng liên quan.

**Dữ liệu:** Chèn lỗi test lần lượt tại ghi order, ghi item thứ2, xóa giỏ, trước commit.

**Các bước:** Mỗi điểm dùng fixture mới; kích hoạt fault injection trên adapter test; đặt; đọc lại dữ liệu bằng kết nối độc lập.

**Kết quả mong đợi:** Mỗi lỗi trước commit rollback toàn bộ: không còn đơn/items mới, kho và giỏ bằng trước ca. Không sửa mã production để chèn lỗi.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-COD-10 — Mất response sau commit

**Liên kết:** UC-13; REQ-CHECKOUT-04, REQ-DATA-02.

**Ưu tiên và cách kiểm tra:** P1; Harness HTTP/MySQL có điều khiển.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca.

**Dữ liệu:** Mô phỏng mất phản hồi khi commit đã hoàn tất.

**Các bước:** Đặt qua harness test có điều khiển điểm lỗi; bỏ response sau commit; đọc lại đơn/kho/giỏ; thử lại trong điều kiện token hỗ trợ.

**Kết quả mong đợi:** Không kết luận “chưa có đơn” từ lỗi mạng; đọc thấy một đơn đã commit, kho trừ một lần và dòng đã xóa. Giới hạn token bộ nhớ/restart phải được ghi riêng.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ORDER-01 — Danh sách, chi tiết và lịch sử snapshot

**Liên kết:** UC-14; REQ-ORDER-01, REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Đăng nhập khách A; địa chỉ ADDR-A hợp lệ thuộc A; không voucher, checkout dùng COD; fixture riêng mới cho ca. A có đơn tạo với giá100.000đ, qty2 và địa chỉ cũ.

**Dữ liệu:** Sau đặt, đổi tên/giá catalog và địa chỉ fixture hiện tại.

**Các bước:** Mở danh sách và chi tiết đơn A; đối chiếu snapshot lúc đặt.

**Kết quả mong đợi:** Đơn vẫn giữ tên/đơn giá/số lượng/địa chỉ lúc đặt; thay dữ liệu hiện tại không thay lịch sử. Không có nút khách tự hủy.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ORDER-02 — Không xem đơn người khác

**Liên kết:** UC-14; REQ-ACCESS-01.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** A sở hữu O-A; B đăng nhập.

**Dữ liệu:** B truy cập chi tiết O-A; lượt khác ID không tồn tại.

**Các bước:** Mở hai URL bằng B; kiểm tra response và dữ liệu trả về.

**Kết quả mong đợi:** Cùng cơ chế404, không trả địa chỉ/chi tiết đơn A; không thay đơn.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ORDER-03 — Lịch sử đơn rỗng, phân trang và lọc

**Liên kết:** UC-14; REQ-ORDER-01.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** A có12 đơn theo các trạng thái; B không có đơn.

**Dữ liệu:** A page1/2/999, lọc pending; B mở /orders.

**Các bước:** Gửi từng truy vấn; đối chiếu ID và trạng thái với fixture.

**Kết quả mong đợi:** A trang1 có10,trang2 có2; vượt cuối kẹp về2; bộ lọc chỉ trả trạng thái tương ứng. B thấy danh sách rỗng.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADMIN-01 — Quyền admin và CSRF

**Liên kết:** UC-16, UC-17, UC-18; REQ-ADMIN-01, REQ-SEC-02.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca.

**Dữ liệu:** Khách chưa đăng nhập; user A; admin gửi thiếu/sai CSRF.

**Các bước:** Mở trang admin bằng khách và A; admin gửi POST đổi trạng thái/thu COD không có CSRF hợp lệ.

**Kết quả mong đợi:** Khách phải đăng nhập; A nhận403 khi vào quản trị; POST admin saiCSRF bị403 và không thay đơn/kho/thanh toán.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADMIN-02 — Tra cứu đơn quản trị

**Liên kết:** UC-16; REQ-ADMIN-01.

**Ưu tiên và cách kiểm tra:** P2; HTTP.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca. Có O1 của A, O2 của B.

**Dữ liệu:** Tìm mã #O1, tên người nhận, điện thoại; filter pending qua query.

**Các bước:** Mở danh sách và từng truy vấn; kiểm tra ID dòng và chi tiết.

**Kết quả mong đợi:** Chỉ đơn khớp xuất hiện; xem chi tiết đúng snapshot. Không đòi câu “2 đơn hàng phù hợp” khi yêu cầu không quy định. Filter query và điều khiển UI được đánh giá riêng.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADMIN-03 — Chuyển đúng trình tự

**Liên kết:** UC-17; REQ-ADMIN-02.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca. Đơn pending/unpaid tuổi1 giờ.

**Dữ liệu:** pending→confirmed→shipping→delivered; mỗi bước confirm=1 và expected_status hiện tại.

**Các bước:** Thực hiện từng bước; đọc lại trạng thái, thanh toán và kho sau mỗi commit.

**Kết quả mong đợi:** Mỗi bước303 và trạng thái đúng; không trừ kho thêm; sau delivered vẫn unpaid cho tới UC-18.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADMIN-04 — Từ chối bỏ bước, trạng thái cũ và thiếu xác nhận

**Liên kết:** UC-17; REQ-ADMIN-02.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca. Mỗi lượt độc lập có đơn pending/unpaid dưới72h.

**Dữ liệu:** pending→shipping; expected_status khác DB; confirm không bằng1.

**Các bước:** Gửi riêng mỗi lỗi; ghi và so trạng thái/kho trước sau.

**Kết quả mong đợi:** Bỏ bước/trạng thái cũ409; thiếu xác nhận422; không thay đơn/kho.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADMIN-05 — Hủy và hoàn kho đúng một lần

**Liên kết:** UC-17; REQ-ORDER-03, REQ-DATA-02.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca. Đơn pending/unpaid có2 sản phẩm V1; stock hiện tại8.

**Dữ liệu:** Hủy với confirm=1 rồi gửi lại.

**Các bước:** Hủy lần1; đọc đơn/kho; gửi lần2 và đọc lại.

**Kết quả mong đợi:** Lần1 cancelled, kho10; lần2 bị409, kho vẫn10; không hoàn tiền hoặc đưa hàng về giỏ.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-ADMIN-06 — Không hủy đơn đã xử lý và không xác nhận đơn hết hạn

**Liên kết:** UC-17; REQ-ADMIN-02, REQ-ADMIN-04.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca.

**Dữ liệu:** Lượt1 đơn confirmed; lượt2 pending/unpaid đúng72h theo DB.

**Các bước:** Gửi hủy lượt1; gửi xác nhận lượt2.

**Kết quả mong đợi:** Lượt1 bị409 không hoàn kho; lượt2 bị409 không thành confirmed. Dùng thời gian DB có kiểm soát để tránh ca biên bị trôi.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CODPAY-01 — Thu COD và xác nhận lặp

**Liên kết:** UC-18; REQ-ADMIN-03.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca. O1 delivered/COD/unpaid.

**Dữ liệu:** confirm=1; request lặp cùng đơn.

**Các bước:** Chụp dữ liệu đơn/kho; xác nhận lần1 rồi lần2.

**Kết quả mong đợi:** Lần1 payment_status=paid; giữ delivered và tiền/kho; lần2 không ghi tác động lần nữa, tiếp tục về chi tiết.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-CODPAY-02 — Từ chối thu trước giao và thiếu xác nhận

**Liên kết:** UC-18; REQ-ADMIN-03.

**Ưu tiên và cách kiểm tra:** P1; HTTP và MySQL test.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca.

**Dữ liệu:** Lượt1 shipping/COD/unpaid confirm1; lượt2 delivered/COD/unpaid khôngconfirm.

**Các bước:** Gửi từng lượt, đọc trạng thái thanh toán.

**Kết quả mong đợi:** Lượt1 trả409; lượt2 trả422; đều giữunpaid, kho không đổi.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTO-01 — Biên 72 giờ

**Liên kết:** AUTO-01; REQ-ORDER-04.

**Ưu tiên và cách kiểm tra:** P1; Service có clock seam; MySQL test khi hỗ trợ.

**Tiền điều kiện:** Đồng hồ MySQL hoặc clock seam test có kiểm soát; ba đơn COD pending/unpaid, mỗi đơn qty1, biến thể riêng stock4.

**Dữ liệu:** Tuổi 71:59:59;72:00:00;72:00:01 tại thời điểm kiểm tra.

**Các bước:** Kích hoạt tick/batch có kiểm soát; đọc trạng thái và kho từng đơn.

**Kết quả mong đợi:** Đơn chưa đủ hạn giữpending/kho4; hai đơn đủ/quá hạn cancelled/kho5 khi được xử lý. Không hẹn giờ ngủ72h hoặc hứa hủy đúng giây.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTO-02 — Không hủy nhầm và quét lặp

**Liên kết:** AUTO-01; REQ-ORDER-03, REQ-ORDER-04.

**Ưu tiên và cách kiểm tra:** P1; Service và MySQL test.

**Tiền điều kiện:** Đơn đối chứng confirmed, shipping, delivered, cancelled; một đơn pending đủhạn/unpaid; kho chuẩn được ghi trước.

**Dữ liệu:** Chạy hai lượt quét.

**Các bước:** Quét lần1 rồi lần2; đối chiếu đơn và kho.

**Kết quả mong đợi:** Chỉ pending đủhạn/unpaid bịhủy; trạng thái đối chứng giữ nguyên; đơn vừa hủy không hoàn kho lần2.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTO-03 — Admin hủy đồng thời với tự hủy

**Liên kết:** AUTO-01, UC-17; REQ-ORDER-03, REQ-DATA-02.

**Ưu tiên và cách kiểm tra:** P1; MySQL thật.

**Tiền điều kiện:** Phiên admin hợp lệ, CSRF hợp lệ; fixture COD không voucher được tạo riêng cho ca. Đơn pending/unpaid đủ72h, qty2, kho8.

**Dữ liệu:** Một request admin hủy, một AUTO batch chồng lấn.

**Các bước:** Đồng bộ hai transaction; đợi kết thúc; đọc đơn/kho.

**Kết quả mong đợi:** Kết quả cancelled, kho10; không thành12. Thao tác thua có thểbỏ qua/409 theo đường gọi.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTO-04 — Batch và con trỏ khi có nhiều đơn

**Liên kết:** AUTO-01; REQ-ORDER-04.

**Ưu tiên và cách kiểm tra:** P2; Service và MySQL test.

**Tiền điều kiện:** 51 đơn COD pending/unpaid đủhạn; fixture độc lập, không đơn khác chen vào.

**Dữ liệu:** Chạy các batch có kiểm soát.

**Các bước:** Gọi batch1, đếm selected/cancelled; batch2; batch3 kiểm tra không hoànkho lặp.

**Kết quả mong đợi:** Batch1 chọn tốiđa50; batch2 xử lý đơn còn lại theo con trỏ; lượt sau không tăngkho lần nữa. Không kết luận toàn bộ đơn được hủy trong một tick.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

### TC-AUTO-05 — Lỗi hoàn kho phải rollback toàn đơn

**Liên kết:** AUTO-01; REQ-DATA-02.

**Ưu tiên và cách kiểm tra:** P1; MySQL test với fault injection.

**Tiền điều kiện:** Đơn pending/unpaid đủhạn có2 biến thể; một biến thể không thể hoàn kho do dữ liệu fixture không hợp lệ.

**Dữ liệu:** Tạo lỗi ở bước hoàn thứ2 bằng adapter test, hoặc dữ liệu test được thiết kế trước.

**Các bước:** Chụp snapshot; chạy batch; đọc đơn và cảhai tồn kho.

**Kết quả mong đợi:** Không để biến thể thứ1 tăngkho riêng lẻ; đơn vẫn chưa được hủy thànhcông; batch ghi nhận lỗi và tiếp tục đơn khác.

**Thực thi:** Not Run. Kết quả thực tế / minh chứng / Bug ID: chưa ghi nhận.

## Bảng truy vết theo use case

| UC | Test case thiết kế |
| --- | --- |
| UC-01 | TC-AUTH-01, TC-AUTH-02, TC-AUTH-03, TC-AUTH-04 |
| UC-02 | TC-AUTH-05, TC-AUTH-06, TC-AUTH-07, TC-AUTH-08 |
| UC-03 | TC-AUTH-09 |
| UC-04 | TC-CAT-01, TC-CAT-02 |
| UC-05 | TC-CAT-03, TC-CAT-04 |
| UC-06 | TC-CAT-05, TC-CAT-06 |
| UC-07 | TC-CAT-07, TC-CAT-08 |
| UC-08 | TC-CART-01, TC-CART-09 |
| UC-09 | TC-CART-02, TC-CART-03, TC-CART-04, TC-CART-05 |
| UC-10 | TC-CART-06, TC-CART-07 |
| UC-11 | TC-CART-08, TC-CART-09 |
| UC-12 | TC-ADDR-01, TC-ADDR-02, TC-ADDR-03 |
| UC-13 | TC-PRICE-01, TC-PRICE-02, TC-PRICE-03, TC-PRICE-04, TC-COD-01, TC-COD-02, TC-COD-03, TC-COD-04, TC-COD-05, TC-COD-06, TC-COD-07, TC-COD-08, TC-COD-09, TC-COD-10 |
| UC-14 | TC-ORDER-01, TC-ORDER-02, TC-ORDER-03 |
| UC-16 | TC-ADMIN-01, TC-ADMIN-02 |
| UC-17 | TC-ADMIN-01, TC-ADMIN-03, TC-ADMIN-04, TC-ADMIN-05, TC-ADMIN-06, TC-AUTO-03 |
| UC-18 | TC-ADMIN-01, TC-CODPAY-01, TC-CODPAY-02 |
| AUTO-01 | TC-AUTO-01, TC-AUTO-02, TC-AUTO-03, TC-AUTO-04, TC-AUTO-05 |

## Biểu mẫu thực thi

| Run ID | TC ID / dòng dữ liệu | Môi trường / commit | Kết quả thực tế | Trạng thái | Minh chứng | Bug hoặc vấn đề |
| --- | --- | --- | --- | --- | --- | --- |
| Chưa chạy | Chọn ID ở trên | Ghi khi chạy | Chưa có | Not Run | Chưa có | Chưa có |

## Giới hạn của bộ thiết kế ban đầu

- Có ca đại diện cho đủ 17 use case và AUTO-01; không đồng nghĩa bao phủ mọi yêu cầu/nhánh. Cần bổ sung khi truy vết chi tiết phát hiện khoảng trống.
- Chưa đủ ca cho mọi giới hạn kích thước, dữ liệu bất thường, mọi điểm lỗi/commit và tổ hợp nhiều phiên. Không cam kết 100% path coverage hoặc MC/DC từ bộ này.
- Các ca MySQL thật và ca đồng thời phải chứng minh đúng đích kết nối, transaction chồng lấn và hậu điều kiện; chạy mock không thay được bằng chứng này.
- Không có use case khách tự hủy; không thêm kiểm thử sâu voucher, chuyển khoản, CRUD địa chỉ, đánh giá hay quản trị sản phẩm.
- Khi chuyển sang kiểm thử UI cần xác nhận điều khiển thực tế. Nếu chỉ có lọc qua query mà thiếu điều khiển trên UI, ghi nhận khả năng/giới hạn quan sát được, không tự tạo nút.

## Thứ tự thực thi đề xuất

1. AUTH cơ bản → CAT → CART để bảo đảm nền tảng dữ liệu và phiên.
2. ADDR → PRICE → COD thành công; sau đó sai dữ liệu, stale quote và token.
3. ORDER → ADMIN → CODPAY → AUTO.
4. Tranh tồn kho, rollback, mất response, đồng thời admin/tự hủy sau khi harness phù hợp và dữ liệu đã sẵn sàng.
5. Gộp kết quả vào Test Execution và Test Report; chỉ tổng hợp ca có cùng phạm vi, đúng môi trường và minh chứng.
