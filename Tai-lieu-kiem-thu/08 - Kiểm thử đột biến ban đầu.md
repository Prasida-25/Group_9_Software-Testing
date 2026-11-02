# Kết quả mutation testing TechZone

## Mục tiêu và cách thực hiện

Đánh giá khả năng phát hiện lỗi của28ca hộp trắng đã có bằng cách thay đổi một quy tắc mỗi lần trên bản sao src riêng. Công cụ tự viết Cong-cu/mutation-check.cjs dùng Node child process để chạy lại cùng bộ test, không phải báo cáo từ Stryker hoặc công cụ mutation tự động khác.

Phạm vi:9đột biến được chọn thủ công tại positiveInteger, variantProblem và quote. Không thay project gốc, không sao chép.env/node_modules, không khởi tạo ứng dụng hoặc kết nối database. Dependencies được phân giải từ node_modules của project qua NODE_PATH. Mỗi lần chạy tạo sandbox mới trong thư mục tạm; bản sao được giữ để đối chiếu, không tự xóa.

Baseline trên bản sao không đột biến phải đạt28/28 trước khi chạymutant. Mỗi biến đổi chỉ được áp dụng nếu chuỗi đích xuất hiện đúng1lần. Kiểm tra cú pháp bằng node --check; timeout20giây. Chỉ xếpKilled khi runner hoàn tất28test và có assertion của testWB thất bại. Syntaxerror, timeout và lỗi môi trường được phân loại riêng, không tính chung làKilled.

## Kết quả lần chạy đầu

Node.js v24.16.0. Baseline28/28Pass. Log vàJSON tại Minh-chung/Mutation/techzone-mutation-dBGJdY; latest.json trỏ đến đợt chạy mới nhất và sẽ thay đổi nếu chạy lại.

| Mutant | Thay đổi có chủ đích | Kết quả | Ca phát hiện |
| --- | --- | --- | --- |
| M01 | positiveInteger: >max thành >=max | Killed | WB-INT-06,07 |
| M02 | Regex cho phép chữ số đầu0 | Killed | WB-INT-02 |
| M03 | variantProblem: giá<=0 thành giá<0 | Killed | WB-VAR-02 |
| M04 | Quantity>stock thành quantity>=stock | Killed | WB-VAR-12 |
| M05 | Miễn phí khi tiền hàng>=300.000 thành >300.000 | Killed | WB-QUOTE-03 |
| M06 | Phí dưới ngưỡng30.000 thành0 | Killed | WB-QUOTE-02 |
| M07 | Đơn giá×quantity thành đơn giá+quantity | Killed | WB-QUOTE-02,03,05,06 |
| M08 | Tổng>giới hạn thành tổng>=giới hạn | Killed | WB-QUOTE-06 |
| M09 | Quantity<1 thành quantity===0 | Survived | Không ca nào trong28ca phát hiện |

| Thống kê | Giá trị |
| --- | ---: |
| Mutant được chọn | 9 |
| Killed | 8 |
| Survived | 1 |
| Invalid / Timeout / Run error | 0 |
| Mutation score trong tập đã chọn | 8/9×100 = 88,89% |

M01–M08 có test phản ví dụ với hành vi kỳ vọng của mã gốc. M09 có phản ví dụ riêng được ghi ở phần sau, do đó không loại nó dưới nhãn tương đương để tăng điểm. Tậpmutant nhỏ và được chọn thủ công, không đại diện mọi lỗi có thể có. Không gọi88,89% là tỷ lệ chất lượng website hay bảo đảm test tốt với mọi lỗi.

## Phân tích mutant sống sót M09

Fixture `{valid_variant:1,price:'100000.00',stock:5}`, quantity=-1:

- Mã gốc trả “Số lượng phải từ1đến99.”
- Mutant trả chuỗi rỗng, tức không phát hiện vấn đề.
- WB-VAR-04 kiểm traquantity0, WB-VAR-10 kiểm tra1.5, WB-VAR-11 kiểm tra100; chưa có caquantityâm gọi trực tiếp variantProblem nên28ca vẫnPass.

Đây là mutant không tương đương trong hợp đồng kiểm tra dữ liệu của hàm, không phải kết luận website hiện tại chấp nhận mua số lượngâm. Route thêm/cập nhật giỏ còn kiểm tra positiveInteger; cần phân biệt kiểm thử hàm với luồngHTTP. Hàm cũng được dùng khi đánh giá dữ liệu giỏ/quote nên ca âm có ý nghĩa đối với dữ liệu bất thường.

Đề xuất caWB-VAR-14: dùng fixture trên, quantity=-1, assert chính xác lỗi số lượng. Trạng thái đề xuất: **Not Run, chưa thêm vào bộ28ca**. Nếu bổ sung, giữ nguyên báo cáo mutation trước cải tiến và chạy lại để so sánh, không thay số liệu cũ thành kết quả mới.

## Minh chứng và bảo toàn mã

- Mỗi mutant có fileTAP riêng, lưu các assertion thất bại; baseline cũng cóTAP.
- results.json chứa thay đổi, IDtest bịFail, phản ví dụM09, phiên bảnNode, thời điểm và đường dẫn sandbox.
- So sánhSHA256 của ba file nghiệp vụ trước/sau: ORIGINAL_SOURCE_UNCHANGED=true.
- Không dùnggitdiff của bảnmutant làm đề xuất sửa website. Lỗi được tạo có chủ đích trên bản sao, không phải bug đang tồn tại trong mã gốc.

## Người thực hiện chạy và chụp

```powershell
node 'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/mutation-check.cjs'
```

Chụp một ảnh có lệnh, BASELINE_PASS28/28, M01–M09, MUTATION_SUMMARY và ORIGINAL_SOURCE_UNCHANGEDtrue. Lưu Minh-chung/Mutation/MUT-01-ket-qua.png. Nếu không đủ màn hình, chụp hai ảnh liên tiếp. Chạy lại tạo đợt minh chứng mới; không ghi đè thư mục kết quả lần đầu.

KILLED và các testFail trong logmutant là kết quả mong đợi khi test phát hiện lỗi cố ý. SURVIVED không phải công cụ chạy hỏng; nó cho biết chưa có test phát hiện biến đổi đó. Nếu cóInvalid/Timeout/Runerror, giữ nguyên và phân tích riêng.

## Đưa vào báo cáo và thuyết trình

Phần thiết kế: mục tiêu, tậpmutant, thao tác thay đổi và tiêu chí phân loại. Phần thực thi: baseline, bảng9mutant, kết quả và liên kếtTAP/JSON. Phần đánh giá: M09, ca bổ sung dự kiến và giới hạn tập nhỏ.

“Ngoài việc kiểm tra28testPass, em tạo9lỗi có chủ đích trên bản sao mã. Bộ test phát hiện8lỗi, còn1lỗi bỏ kiểm tra số lượngâm chưa được phát hiện. Em tìm phản ví dụquantity=-1 và đề xuất thêmtest. Việc này cho thấy testPass haycoveragecao chưa đủ để kết luận bộtest phát hiện mọi lỗi.”

## Ảnh bổ sung từ Screenshots.zip

Đã bổ sung ảnh người thực hiện vào nhóm minh chứng tương ứng. Tênảnh, nguồnZIP, nội dung vàgiới hạn được ghi tại [bảng kiểm kê](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Không tính ảnh như lượt thực thi mới; mutation phải đối chiếu đúng runID ghi trongảnh.
