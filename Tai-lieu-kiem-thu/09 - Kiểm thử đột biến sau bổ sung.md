# Đánh giá mutation trước và sau bổ sung test

## Khoảng trống và thay đổi bộ test

Lần mutation đầu, M09 thay quantity<1 bằng quantity===0 trong variantProblem nhưng cả28test vẫnPass. Phản ví dụ quantity=-1 với biến thể hợp lệ trả lỗi ở mã gốc và chuỗi rỗng ởmutant. Do đó M09 không tương đương và bộtest thiếu ca kiểm tra số lượngâm tại hàm.

Đã bổ sung WB-VAR-14 trong Cong-cu/whitebox-extended.test.cjs. File này nạp nguyên28ca từ whitebox.test.cjs và thêm đúng1ca: gọi variantProblem với `{valid_variant:1,price:'100000.00',stock:5}`, quantity=-1, assert thông báo “Số lượng phải từ1đến99.” theo chuỗi chính xác trong mã. Không sửa hàm nghiệp vụ hoặc28ca ban đầu.

Ca gọi hàm trực tiếp, không kết nối database. Nó kiểm tra hợp đồng của variantProblem đối với dữ liệu bất thường; không chứng minh route hiện tại chấp nhận quantityâm vì route còn validation riêng.

## Kết quả thực thi

| Chỉ tiêu | Trước bổ sung | Sau bổ sung |
| --- | ---: | ---: |
| Baseline trên mã không đột biến | 28/28Pass | 29/29Pass |
| Mutant, cùng9biến đổi | 9 | 9 |
| Killed | 8 | 9 |
| Survived | 1 | 0 |
| Invalid/Timeout/Runerror | 0 | 0 |
| Mutation score trên tập đã chọn | 88,89% | 100,00% |
| M09 | Survived | Killed bởiWB-VAR-14 |
| SHA256 mã gốc sau chạy | Không đổi | Không đổi |

Lần sau bổ sung: Node.js v24.16.0, bộharness tự viết cùng9biến đổi, phạm vi và tiêu chí phân loại không đổi; timeout20giây/mutant. Mỗi lần chạy trên bản sao mới trong thư mục tạm, không có.env, không ghi database.

M01–M08 vẫn bị các ca cũ phát hiện. M09 có đúng caWB-VAR-14 thất bại trong lần chạymutant. Baseline29/29Pass chứng minh ca mới khớp hành vi đúng của mã gốc trước khi đánh giámutant.

Kết quả này hỗ trợ nhận xét: bổ sung một ca có mục đích có thể tăng khả năng phát hiện lỗi mà không cần tăng số lượngtest tùy ý. Tuy nhiên100% chỉ là9/9mutant được chọn thủ công, không bảo đảm phát hiện mọi lỗi, không thay cho coverage hoặcMC/DC, không phải điểm chất lượng toànwebsite.

## File và cách tái lập

- Kết quả trước: xem 08 - Kiểm thử đột biến ban đầu.md và thư mục Minh-chung/Mutation/techzone-mutation-dBGJdY.
- Kết quả sau: Minh-chung/Mutation/techzone-mutation-Bft61B/results.json và cácfileTAP cùng thư mục.
- Cong-cu/mutation-check.cjs chạy mặc định bộ28ca; cờ--extended chọn bộ29ca. Mỗi lần tạo thư mục mới; latest.json chỉ trỏ đợt gần nhất, không thay thế dữ liệu lịch sử.

Chạy baseline mở rộng riêng:

```powershell
node --test 'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/whitebox-extended.test.cjs'
```

Chạy lại cùng9mutant với bộ mở rộng:

```powershell
node 'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/mutation-check.cjs' --extended
```

Chụp minh chứng MUT-02-sau-bo-sung.png có lệnh--extended, BASELINE_PASS29/29, M09KILLED bởiWB-VAR-14, tổngkilled9/survived0 và ORIGINAL_SOURCE_UNCHANGEDtrue. Lưu trong Minh-chung/Mutation. Các assertionFail ởmutant là dấu hiệu phát hiện lỗi có chủđích; không ghi chúng thành lỗi website.

Các bảng thiết kế và báo cáo lầnđầu giữ nguyên theo trạng thái lịch sử; dùng tài liệu bổ sung này để ghi WB-VAR-14 đã được triển khai vàPass. Không dùng việc mutation đạt9/9 để gánPass cho59TC nghiệp vụ hoặc bỏ qua sai lệch giá“từ”. Chưa đo lạicoverage cho bộ29ca; không trình bày bảngcoverage của28ca như là lần đo mới.

## Đoạn trình bày báo cáo

“Lầnđầu bộ28ca phát hiện8/9đột biến. Em phân tích độtbiến sốngsót và bổ sung ca số lượngâm. Với cùng9độtbiến, bộ29ca phát hiện9/9; baseline vẫnđạt. Mãwebsite gốc khôngthayđổi. Kếtquả chỉ áp dụng cho tậpđộtbiến đãchọn, cho thấy cải tiến cụthể của bộtest.”

## Ảnh bổ sung từ Screenshots.zip

Đã bổ sung ảnh người thực hiện vào nhóm minh chứng tương ứng. Tênảnh, nguồnZIP, nội dung vàgiới hạn được ghi tại [bảng kiểm kê](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Không tính ảnh như lượt thực thi mới; mutation phải đối chiếu đúng runID ghi trongảnh.
