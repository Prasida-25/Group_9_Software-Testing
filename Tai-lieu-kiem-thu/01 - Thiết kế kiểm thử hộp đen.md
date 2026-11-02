# Thiết kế kiểm thử hộp đen TechZone

Tài liệu giải thích cách suy ra dữ liệu kiểm thử từ yêu cầu trong Plan.docx, phục vụ phần thiết kế kiểm thử của báo cáo. Các bảng này là thiết kế, không phải kết quả thực thi. Các ca bổ sung chưa chạy giữ trạng thái Not Run; không suy ra đạt chỉ từ ảnh luồng thành công.

Phạm vi: sáu nhóm chức năng đã thống nhất và AUTO-01, COD không voucher, chọn địa chỉ đã lưu. Khách không có use case tự hủy. Mỗi giá trị trong bảng biên cần có lần chạy độc lập, fixture và kết quả tương ứng.

## 1 Phân vùng tương đương

Giữ các đầu vào khác hợp lệ khi kiểm tra một lớp lỗi, để kết quả không bị che bởi lỗi khác. Các dữ liệu dưới đây là dữ liệu nhân tạo, không phải thông tin tài khoản thật.

| Đối tượng | Lớp hợp lệ | Lớp không hợp lệ | Ví dụ và liên kết |
| --- | --- | --- | --- |
| Điện thoại đăng ký | Sau chuẩn hóa là 10 chữ số, bắt đầu 03/05/07/08/09, chưa tồn tại | Sai đầu số, thiếu/thừa chữ số, ký tự chữ, trùng tài khoản | 0900000023; +84900000023 tương đương sau chuẩn hóa; 0123456789 sai đầu số. TC-AUTH-01/03; thêm BB-AUTH-01 cho các lớp định dạng chưa có đủ dữ liệu |
| Họ tên | Sau trim/gộp khoảng trắng dài 1–100 ký tự, không có ký tự điều khiển | Rỗng sau chuẩn hóa, quá 100, có ký tự điều khiển | TC-AUTH-02; không dùng chuỗi toàn khoảng trắng để đại diện tên dài hợp lệ |
| Mật khẩu đăng ký | Chuỗi 8–128 ký tự, có chữ cái ASCII và chữ số | Ngắn/dài quá mức, thiếu chữ hoặc số; xác nhận không trùng | TC-AUTH-02/04. Không áp điều kiện tối thiểu 8 ký tự của đăng ký cho validation form đăng nhập |
| Thông tin đăng nhập | Số tồn tại, đúng mật khẩu, vai trò được hỗ trợ | Sai mật khẩu hoặc số không tồn tại | TC-AUTH-05/06: hai lỗi dùng thông báo chung |
| Từ khóa tìm | Chuỗi đơn sau chuẩn hóa dài ≤200, không ký tự điều khiển; có/không có kết quả đều là đầu vào hợp lệ | >200, dạng mảng, ký tự điều khiển còn lại sau chuẩn hóa | TC-CAT-03/04. Không có kết quả không đồng nghĩa request sai |
| Khoảng giá | Không âm, tối đa 10 chữ số nguyên và 2 thập phân; min≤max | Âm, sai định dạng, min>max | TC-CAT-05/06; có thể bỏ trống một hoặc cả hai cận |
| Biến thể khi thêm giỏ | Tồn tại, quan hệ thuộc tính hợp lệ, giá>0, còn hàng | Không tồn tại/sai quan hệ, giá không dương, hết hàng | TC-CART-03/04/09; bổ sung BB-CART-01 cho giá và tính hợp lệ biến thể |
| Số lượng mua | Số nguyên 1–99 và không vượt kho | Rỗng, không nguyên, ≤0, >99, vượt kho | TC-CART-03/04. Với thêm lại, kiểm tra số lượng sau cộng |
| Địa chỉ checkout | Đã lưu, hợp lệ, thuộc tài khoản hiện tại | Không có địa chỉ, ID không tồn tại, địa chỉ của người khác hoặc dữ liệu địa chỉ lỗi | TC-ADDR-01/02/03; BB-ADDR-01 cho dữ liệu địa chỉ lưu không hợp lệ |
| Chủ sở hữu | Dòng giỏ/đơn thuộc tài khoản từ phiên | Tài khoản khác hoặc chưa đăng nhập | TC-CART-01/07/08, TC-ORDER-02, TC-ADMIN-01 |
| Đơn được hủy bởi admin | COD pending/unpaid | confirmed, shipping, delivered, cancelled hoặc đã thanh toán | TC-ADMIN-05/06; ca từng trạng thái phải có lượt riêng |

## 2 Phân tích giá trị biên

Biên được suy ra từ yêu cầu trước khi chạy. Các tổ hợp phải bảo đảm không đồng thời vi phạm điều kiện khác.

| Đại lượng | Dữ liệu biên | Kỳ vọng | Ca liên quan |
| --- | --- | --- | --- |
| Độ dài tên sau chuẩn hóa | 0, 1, 2, 99, 100, 101 | 1–100 hợp lệ; 0/101 bị từ chối | TC-AUTH-02; bổ sung dòng 2/99 |
| Độ dài mật khẩu đăng ký | 7, 8, 9, 127, 128, 129 | 8–128 được nhận nếu có chữ và số; 7/129 bị từ chối | TC-AUTH-02; bổ sung dòng 9/127 |
| Độ dài điện thoại chuẩn hóa | 9, 10, 11 chữ số | 10 chỉ hợp lệ khi đúng mẫu đầu số; 9/11 không hợp lệ | BB-AUTH-01. Dùng dạng bắt đầu 0 để tránh 11 chữ số được hiểu là tiền tố 84 |
| Độ dài từ khóa | 0, 1, 199, 200, 201 | 0 bỏ lọc; 1–200 được xử lý; 201 trả400 | TC-CAT-03/04; thêm dòng 1/199 |
| Số lượng, với stock=100 | 0, 1, 2, 98, 99, 100 | 1–99 được nhận; 0/100 bị từ chối | TC-CART-03; thêm dòng 2/98 |
| Số lượng, với stock=5 | 4, 5, 6 | 4/5 được nhận; 6 vượt kho | TC-CART-04 và BB-CART-02 |
| Thêm lại, có sẵn4 và stock5 | Thêm1; thêm2 từ fixture khởi đầu độc lập | Thành5; hoặc từ chối và giữ4 | TC-CART-04 |
| Tiền hàng, đơn vị đồng | 299.999; 300.000; 300.001 | Phí30.000; 0; 0. Tổng329.999; 300.000; 300.001 | TC-PRICE-01/02/03 |
| Tiền hàng, nếu xét DECIMAL(12,2) | 299999.99; 300000.00; 300000.01 | Phí30000.00; 0.00; 0.00 | BB-PRICE-01; ảnh đơn80.000đ chưa chứng minh biên này |
| Tuổi đơn theo thời gian MySQL | 71:59:59; 72:00:00; 72:00:01 | Chưa đủ hạn không hủy; đúng/quá hạn đủ điều kiện chọn nếu pending/unpaid/COD | TC-AUTO-01; dùng clock seam phù hợp, không suy ra biên chính xác từ test71/73giờ |
| TTL token checkout | Ngay trước20phút; đúng20phút; ngay sau20phút | Trước hạn được xử lý nếu dữ liệu hợp lệ; tại/sau hạn bị từ chối | TC-COD-06; harness điều khiển clock, không chờ bằng thao tác thủ công |

Độ dài mật khẩu tính theo cách JavaScript đo chuỗi; dùng ASCII để bảng biên dễ tái lập. Đầu vào bị trình duyệt chặn cần test HTTP riêng để kiểm tra validation server.

## 3 Bảng quyết định phí vận chuyển

REQ-SHIP-01, REQ-PRICE-03. Điều kiện: checkout hợp lệ, chỉ COD, không voucher. Hai quy tắc loại trừ nhau và bao phủ toàn miền tiền hàng hợp lệ.

| Điều kiện hoặc hành động | R1 | R2 |
| --- | --- | --- |
| Tiền hàng ≥300.000đ | Có | Không |
| Miễn phí vận chuyển | Có | Không |
| Phí | 0đ | 30.000đ |
| Tổng thanh toán | Tiền hàng | Tiền hàng +30.000đ |
| Dữ liệu đại diện | 300.000đ | 299.999đ |
| Test case | TC-PRICE-02/03 | TC-PRICE-01 |

Không dùng chính sách VIP hoặc mốc500.000đ của bài lab để thay nghiệp vụ TechZone.

## 4 Bảng quyết định thêm giỏ

REQ-CART-01/02/04/05. Bảng rút gọn theo thứ tự kiểm tra; dấu “–” là không cần xét sau điều kiện loại trừ. CSRF hợp lệ trong R2–R5; ca sai CSRF thiết kế riêng. Các cột không yêu cầu chạy tất cả tổ hợp vô nghĩa.

| Điều kiện hoặc hành động | R1 | R2 | R3 | R4 | R5 |
| --- | --- | --- | --- | --- | --- |
| Đã đăng nhập | Không | Có | Có | Có | Có |
| ID và quantity gửi lên hợp lệ | – | Không | Có | Có | Có |
| Biến thể hợp lệ, giá dương, có kho | – | – | Không | Có | Có |
| Tổng quantity sau cộng ≤99 và ≤stock | – | – | – | Không | Có |
| Kết quả | Chuyển đăng nhập | 422 | 422 | 422 | Ghi giỏ,303 |
| Kho thay đổi | Không | Không | Không | Không | Không |
| Ca liên quan | TC-CART-01 và BB-CART-03 | TC-CART-03 | BB-CART-01 | TC-CART-04 | TC-CART-02 |

R5 gồm hai nhánh dữ liệu: chưa có dòng thì thêm mới; có dòng cùng biến thể thì cộng quantity vào dòng đó. Không coi thêm giỏ là thao tác giữ/trừ kho hoặc có token chống gửi lặp.

## 5 Bảng quyết định đặt COD

REQ-CHECKOUT-01 đến06, REQ-DATA-01/02. Luồng dưới mô tả các cổng quyết định nghiệp vụ. Thứ tự mã lỗi thực tế còn phụ thuộc middleware và thứ tự kiểm tra; không tự gán một status chung cho mọi lỗi.

| Cổng | Điều kiện phải đạt | Nếu không đạt | Ca liên quan |
| --- | --- | --- | --- |
| C1 | Có phiên và CSRF hợp lệ | Yêu cầu đăng nhập hoặc từ chối CSRF | TC-COD-02, TC-ADMIN-01 ở phạm vi CSRF quản trị; thêm BB-COD-01 cho checkout |
| C2 | Token còn hạn, thuộc người dùng, trạng thái cho phép | Từ chối; token done trong hạn trả lại cùng đơn | TC-COD-06/07 |
| C3 | Các dòng chọn tồn tại và thuộc giỏ | Danh sách sai400; dòng không thuộc giỏ409 | TC-COD-04 |
| C4 | Địa chỉ đã lưu hợp lệ và thuộc người dùng | Không cho đặt; sai chủ sở hữu409 | TC-ADDR-01/02/03 |
| C5 | Phương thức đúngCOD, không voucher trong fixture | Không dùng kết quả ca ngoài phạm vi thay cho caCOD | TC-COD-02 |
| C6 | Dữ liệu dưới khóa còn hợp lệ: giá, qty, kho, báo giá | Từ chối báo giá cũ hoặc thiếu kho | TC-COD-03/05/08 |
| C7 | Ghi order/items, trừ kho, xóa dòng chọn cùng transaction thành công | Lỗi trước commit rollback; commit chưa rõ phải đối chiếu | TC-COD-01/09/10 |

Từ bảng cổng thiết kế một ca tất cả điều kiện hợp lệ và từng ca một điều kiện bị vi phạm, giữ các cổng trước đó hợp lệ. Bảng này là phân rã để quản lý nhiều điều kiện, không tuyên bố đã liệt kê toàn bộ tổ hợp2^n.

## 6 Bảng quyết định admin hủy và thu COD

Điều kiện nền: admin được xác thực, CSRF hợp lệ, ID đơn tồn tại; trạng thái được đọc lại dưới khóa.

| Thao tác | Có confirm=1 | Điều kiện đơn | Kết quả | Ca liên quan |
| --- | --- | --- | --- | --- |
| Hủy | Không | Bất kỳ | 422; không đổi dữ liệu | TC-ADMIN-04 |
| Hủy | Có | COD pending/unpaid | Hủy và hoàn kho trong transaction | TC-ADMIN-05 |
| Hủy | Có | Ngoài pending hoặc không unpaid | 409; không hoàn kho | TC-ADMIN-06 |
| Thu COD | Không | Bất kỳ | 422; không ghi thanh toán | TC-CODPAY-02 |
| Thu COD | Có | COD delivered/unpaid | payment_status=paid; giữ delivered và kho | TC-CODPAY-01 |
| Thu COD | Có | COD delivered/paid | Không ghi nhận tác động lần nữa | TC-CODPAY-01 |
| Thu COD | Có | Chưa delivered hoặc không phảiCOD | 409; giữ nguyên | TC-CODPAY-02; biến thể khôngCOD ngoài phạm vi sâu |

Thiếu ID, thiếu quyền hoặc saiCSRF có thể bị từ chối trước các hàng này. Hủy pending/unpaid thủ công không yêu cầu đơn dưới72giờ; xác nhận pending thành confirmed phải còn dưới72giờ.

## 7 Chuyển trạng thái

Phân biệt status của đơn và payment_status. Trong phạm viCOD: tạo đơn trừ kho, chuyển trạng thái không trừ kho lần nữa; giao xong chưa tự thành đã thu tiền.

| Nguồn | Sự kiện | Điều kiện | Đích | Ca |
| --- | --- | --- | --- | --- |
| Chưa có đơn | ĐặtCOD | Các điều kiện checkout đều đạt | pending/unpaid | TC-COD-01 |
| pending/unpaid | Admin xác nhận | Chưa đủ72giờ; xác nhận hợp lệ | confirmed/unpaid | TC-ADMIN-03 |
| confirmed/unpaid | Admin giao vận | Xác nhận hợp lệ | shipping/unpaid | TC-ADMIN-03 |
| shipping/unpaid | Admin ghi nhận giao thành công | Xác nhận hợp lệ | delivered/unpaid | TC-ADMIN-03 |
| delivered/unpaid | Admin xác nhận thuCOD | Đã đối soát đủ tiền fixture | delivered/paid | TC-CODPAY-01 |
| pending/unpaid | Admin hủy | Xác nhận hợp lệ | cancelled/unpaid; hoàn kho | TC-ADMIN-05 |
| pending/unpaid | AUTO quét | Tuổi≥72giờ, được chọn xử lý | cancelled/unpaid; hoàn kho | TC-AUTO-01/02 |

Các chuyển không hợp lệ cần kiểm tra: pending→shipping, confirmed→pending, shipping→cancelled, delivered→cancelled, cancelled→confirmed. Mỗi chuyển có fixture riêng và xác minh status/payment/kho không đổi. TC-ADMIN-04/06 chưa có đủ mọi hàng; bổ sung BB-STATE-01.

### Ma trận tuổi đơn và trạng thái đối với AUTO

| Trạng thái COD | Tuổi<72giờ | Tuổi≥72giờ |
| --- | --- | --- |
| pending/unpaid | Giữ nguyên | Đủ điều kiện tự hủy |
| confirmed/unpaid | Giữ nguyên | Giữ nguyên |
| shipping/unpaid | Giữ nguyên | Giữ nguyên |
| delivered/unpaid hoặc paid | Giữ nguyên | Giữ nguyên |
| cancelled/unpaid | Giữ nguyên, không hoàn kho thêm | Giữ nguyên, không hoàn kho thêm |

Pending/paid không phải luồngCOD thông thường; có thể dùng fixture bất thường riêng để kiểm tra loại trừ khi cần. Hết hạn là điều kiện lựa chọn, không cam kết xử lý đúng giây đủ72giờ. Batch, khóa và thời gian ứng dụng dừng ảnh hưởng độ trễ.

## 8 Ca bổ sung và trạng thái thực thi

Các mãBB dưới đây là thiết kế bổ sung, không đổi số59 của danh sách TC gốc. Chỉ cộng khi đưa vào sổ test case chính và xác định cách đếm thống nhất.

| ID | Dữ liệu và thao tác | Kết quả mong đợi | Trạng thái |
| --- | --- | --- | --- |
| BB-AUTH-01 | Gửi đăng ký với số9/10/11chữ số bắt đầu0, đầu012 sai, chữ xen số; các trường khác hợp lệ | Chỉ mẫu10chữ số đúng đầu số được nhận nếu chưa trùng | Not Run |
| BB-CART-01 | Thêm biến thể không tồn tại, giá0, stock0 hoặc quan hệ thuộc tính sai; từng fixture độc lập | 422; giỏ và kho không đổi | Not Run |
| BB-CART-02 | Stock5, giỏ mới; lần lượt thêm4,5,6 với reset giữa lượt | Nhận4/5; từ chối6, không ghi dở dang | Not Run |
| BB-CART-03 | Phiên khách gửi thêm hàng vớiCSRF hợp lệ lấy từ form; sau đó đăng nhập | Chuyển đăng nhập; không tự thêm sản phẩm sau đăng nhập | Not Run |
| BB-ADDR-01 | Địa chỉ fixture thuộcA nhưng thiếu trường bắt buộc; chọn khi checkout | 409; không cho đặt đơn | Not Run |
| BB-PRICE-01 | quote với tiền hàng299999.99,300000.00,300000.01, hàng/qty hợp lệ | Phí30000.00,0.00,0.00; tổng329999.99,300000.00,300000.01 | Not Run |
| BB-COD-01 | A có giỏ/địa chỉ/token; POST checkout thiếu hoặc saiCSRF | 403; order/items/kho/giỏ không đổi | Not Run |
| BB-STATE-01 | Gửi từng cặp chuyển không hợp lệ nêu tại mục7, đúngadmin/CSRF/confirm | 409; trạng thái, thanh toán và kho không đổi | Not Run |

## 9 Liên hệ với minh chứng đã có

- Ảnh catalog chứng minh hai giá biến thể và việc tìm rỗng; thẻ thiếu chữ“từ” là sai lệch cần giữ trong danh sách vấn đề.
- Ảnh giỏ chứng minh các trạng thái số lượng1→2→3 và xóa dòng theo thao tác người thực hiện; không thay thế ca sai dữ liệu hoặc quyền sở hữu.
- Đơn409 là luồngCOD50.000đ +30.000đ phí, giao hàng rồi xác nhận thuCOD. Nó đại diện vùng dưới300.000đ, không chứng minh hai biên còn lại.
- Đơn410 cung cấp minh chứng hủy và đối chiếu hoàn2sản phẩm; không chứng minh hủy đồng thời.
- Đơn411/412 và logAUTO chứng minh hai tuổi mô phỏng73/71giờ, quét lặp và hoànkho trong phạm vi IDfixture. Chưa chứng minh đúng72giờ, batch50, bộ lập lịch60giây hoặc tranh chấp admin/AUTO.
- Test có sẵn có thể dùng dữ liệu khác các bảng này; phải đối chiếu từng assertion trước khi đánh dấu các dòng mới Pass.

## 10 Cách giải thích khi thuyết trình

“Từ yêu cầu, em chia đầu vào thành nhóm hợp lệ và không hợp lệ, sau đó chọn điểm sát giới hạn để dễ phát hiện lỗi so sánh. Với nhiều điều kiện phối hợp, em dùng bảng quyết định. Với đơn hàng, em mô hình hóa trạng thái để kiểm tra cả chuyển hợp lệ và chuyển bị cấm. Em tách thiết kế với kết quả thực thi: mỗi kết luận đạt phải gắn dữ liệu, lần chạy và minh chứng cụ thể.”

Nội dung phương pháp đặt trong phần thiết kế kiểm thử của báo cáo; kết quả, ảnh vàlog đặt trong phần thực thi. Khả năng truy vết và cách chọn dữ liệu quan trọng hơn việc tăng số ca.
