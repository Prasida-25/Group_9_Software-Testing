# Kết quả kiểm thử hộp trắng TechZone

## Phạm vi và kết quả

Bộ test tại Cong-cu/whitebox.test.cjs thực thi28ca WB đã thiết kế, import hàm thật từ project qua đường dẫn TECHZONE_PROJECT (mặc định đường dẫn local hiện tại). Không khởi tạo ứng dụng, không kết nối hoặc ghi database. Không thay đổi mã website, package.json hoặc các test trong project.

Môi trường lần chạy này: Node.js v24.16.0. Công cụ đo: Node test runner với --experimental-test-coverage và dữ liệu V8. Công cụ này được gắn nhãn experimental bởi Node; giữ phiên bản khi tái lập.

| Nhóm | Số ca | Pass | Fail |
| --- | ---: | ---: | ---: |
| WB-INT-01 đến08 | 8 | 8 | 0 |
| WB-VAR-01 đến13 | 13 | 13 | 0 |
| WB-QUOTE-01 đến07 | 7 | 7 | 0 |
| Tổng | 28 | 28 | 0 |

Đã đối chiếu kết quả trả về/thông báo lỗi của variantProblem, status ngoại lệ positiveInteger/quote, tiền hàng/phí/tổng và số dòng quote. Các ca không chỉ kiểm tra không crash. Pass28/28 là tỷ lệ của bộ test này, không phải tỷ lệ đạt yêu cầu toàn website.

## Lệnh chạy lại và chụp minh chứng

Chạy từ PowerShell trong project, giữ nguyên dấu backtick ở cuối dòng nếu sao chép lệnh nhiều dòng:

```powershell
node --test --experimental-test-coverage `
  '--test-coverage-include=**/src/utils/cart-validation.js' `
  '--test-coverage-include=**/src/services/cart-service.js' `
  '--test-coverage-include=**/src/utils/checkout.js' `
  'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/whitebox.test.cjs'
```

Không cần tự đặt NODE_V8_COVERAGE chỉ để chụp ảnh console; lần đo đã lưu dữ liệuV8 riêng. Nếu Node bị thay phiên bản hoặc project di chuyển cần xác nhận lại runtime và TECHZONE_PROJECT trước khi chạy.

Ảnh cần chụp sau khi thực sự chạy lại:

1. WB-01-danh-sach.png: lệnh và các tên testWB; có thể chụp thêm vùng còn lại nếu không đủ màn hình.
2. WB-02-tong-ket-coverage.png: tổng tests28/pass28/fail0 và bảng coverage ba file.

Lưu trong Minh-chung/Hop-trang. Không dựng ảnh màn hình từ log. Nếu kết quả khác phải giữ kết quả thực tế và điều tra, không sửa số theo báo cáo này.

## Coverage thực đo của ba file

| File | Line % | Branch % | Functions % | Dòng chưa chạy theo report |
| --- | ---: | ---: | ---: | --- |
| src/services/cart-service.js | 24.56 | 100.00 | 50.00 | 13–55 |
| src/utils/cart-validation.js | 100.00 | 93.33 | 100.00 | Không có dòng chưa chạy được liệt kê |
| src/utils/checkout.js | 50.88 | 85.71 | 42.86 | 24–31,34–40,42–48,50–55 |
| All files trong bộ lọc | 50.00 | 93.48 | 61.54 | Theo ba hàng trên |

Đây là số liệu nguyên nhãn công cụ cho ba file được lọc, không phải toànbackend. Node báo line/branch/functions; không đổi tên line coverage thành statement coverage hoặc tự suy ra MC/DC.

### Cách giải thích những số liệu dễ hiểu nhầm

- cart-service.js chỉ được gọi variantProblem; createCartService và các hàm xử lý giỏ bên trong chưa chạy. Branch100% ở hàng này không phủ định line24.56% và functions50%; không coi nó là bảo đảm mọi nhánh của các hàm chưa gọi đã được kiểm thử. Mẫu số branch phụ thuộc cách V8/Node xây report.
- cart-validation.js có line100% nhưng branch93.33%: một dòng có thể có nhiều nhánh, như biểu thức OR hoặc toán tử3ngôi; đi qua dòng không đồng nghĩa mọi nhánh đã chạy.
- checkout.js gồm nhiều hàm địa chỉ, fingerprint và chọn dòng ngoài quote. Bộ test quote chưa bao phủ các hàm đó; callback còn có nhánh fallback product_id/tên chưa được kích hoạt bởi fixture sản phẩm hợp lệ.
- Các số này giúp thấy phạm vi và khoảng trống. Chưa đặt mục tiêu100% cho toànfile và không bổ sung ca vô nghĩa chỉ để tăng phần trăm. Nếu mở rộng, ca mới phải gắn yêu cầu hoặc lỗi có ý nghĩa.

## Đối chiếu dữ liệu V8 ở các hàm được chọn

Dữ liệu JSON trong Minh-chung/Hop-trang/v8 ghi:

| Hàm có tên | Số lần gọi ở range ngoài | Số range có count>0 / range ghi nhận |
| --- | ---: | ---: |
| positiveInteger | 8 | 6/6 |
| variantProblem | 22 | 16/16 |
| quote | 7 | 7/7 |

variantProblem được gọi13lần từ nhómVAR và thêm từ các dòng quote nên tổng22lần. Các range lồng nhau và callback có phạm vi riêng. Tỷ lệrange ở bảng này chỉ mô tả JSON, không phải công thức coverage branch/statement/MC/DC và không thay cho bảng chính thức của công cụ.

Hai CFG trong thiết kế vẫn dùng quy ước đã ghi: positiveInteger tách short circuit V=5; variantProblem gộpif V=6, hoặc V=11 khi tách toán hạng. Không dùng phần trăm của công cụ để suy ngược cyclomatic complexity.

## Minh chứng lưu tại máy

- Minh-chung/Hop-trang/whitebox-run-01.tap: kết quả TAP đầy đủ28ca và coverage.
- Minh-chung/Hop-trang/v8/: dữ liệu coverage V8 của lần đo, cần giữ cùng log và phiên bản mã khi sử dụng.
- Cong-cu/whitebox.test.cjs: mã thực thi theo28ID trong thiết kế.

Không ghi đè trạng thái của59TC nghiệp vụ: các mãWB là bộ riêng; một caWB có thể hỗ trợ yêu cầu củaTC nhưng chưa thay thế toàn bộ các bước/fixture củaTC.

## Giới hạn và việc còn lại

- Chưa thực hiện mutation hoặc kết luận strict unique-cause/masking MC/DC.
- Chưa đo coverage khi chạy toànbộ93test hoặc toànbộ28kịch bảnMySQL; không cộng các tỷ lệ từ các lần chạy khác phạm vi.
- Đây là kiểm thử hàm, không chứng minh transaction, UI, trạng thái đơn hoặc tải hệ thống.
- CFG hiện là Mermaid trong tài liệu thiết kế, chưa có bản hình để chènWord/PDF.
- Khi biên soạn báo cáo: đặtCFG/đường đi và mục tiêu ở phần thiết kế; đặt28/28 cùng bảngcoverage, minh chứng và giới hạn ở phần thực thi/đánh giá.

## Đoạn diễn giải ngắn để thuyết trình

“Em đã triển khai28ca hộp trắng gọi trực tiếp hàmJavaScript củaTechZone. Cả28ca đạt. Em đo bằngNode/V8 trên3file, nhưng không lấy số đó làmcoverage toànwebsite. Ví dụ filecart-service có nhiều hàm chưa chạy nênlinecoverage chỉ24,56%, dù cộtbranch ghi100%. Em đọc các chỉ số cùng phạm vi và phần chưa chạy; chưa coi branchcoverage làMC/DC.”

## Ảnh bổ sung từ Screenshots.zip

Đã bổ sung ảnh người thực hiện vào nhóm minh chứng tương ứng. Tênảnh, nguồnZIP, nội dung vàgiới hạn được ghi tại [bảng kiểm kê](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Không tính ảnh như lượt thực thi mới; mutation phải đối chiếu đúng runID ghi trongảnh.
