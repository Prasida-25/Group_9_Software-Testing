# Kết quả Lighthouse và responsive

Đối chiếu ngày 02/11/2026: đọc JSON nhúng trong các HTML gốc, không chạy audit mới.

## Lighthouse

| Báo cáo | Thiết bị | Performance | Accessibility | Best Practices | SEO | FCP (ms) | LCP (ms) | TBT (ms) | CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| [LH-CAT-D-01.html](../Lighthouse/LH-CAT-D-01.html) | desktop | 89 | 91 | 100 | 91 | 1454.11 | 1534.11 | 0.00 | 0.00205 |
| [LH-CAT-D-02.html](../Lighthouse/LH-CAT-D-02.html) | desktop | 89 | 91 | 100 | 91 | 1452.28 | 1532.28 | 0.00 | 0.00205 |
| [LH-CAT-D-03.html](../Lighthouse/LH-CAT-D-03.html) | desktop | 89 | 91 | 100 | 91 | 1452.47 | 1532.47 | 0.00 | 0.00205 |
| [LH-CAT-M-01.html](../Lighthouse/LH-CAT-M-01.html) | mobile | 58 | 91 | 100 | 91 | 7959.55 | 8259.55 | 0.00 | 0.00029 |
| [LH-CAT-M-02.html](../Lighthouse/LH-CAT-M-02.html) | mobile | 58 | 91 | 100 | 91 | 7958.13 | 8258.13 | 0.00 | 0.00033 |
| [LH-CAT-M-03.html](../Lighthouse/LH-CAT-M-03.html) | mobile | 58 | 91 | 100 | 91 | 7959.70 | 8259.70 | 0.00 | 0.00033 |
| [LH-DETAIL-D-01.html](../Lighthouse/LH-DETAIL-D-01.html) | desktop | 89 | 93 | 100 | 91 | 1451.99 | 1531.99 | 0.00 | 0.00050 |
| [LH-DETAIL-D-02.html](../Lighthouse/LH-DETAIL-D-02.html) | desktop | 89 | 93 | 100 | 91 | 1451.80 | 1551.80 | 0.00 | 0.00965 |
| [LH-DETAIL-D-03.html](../Lighthouse/LH-DETAIL-D-03.html) | desktop | 89 | 93 | 100 | 91 | 1452.53 | 1532.53 | 0.00 | 0.00965 |
| [LH-DETAIL-M-01.html](../Lighthouse/LH-DETAIL-M-01.html) | mobile | 58 | 93 | 100 | 91 | 7960.05 | 8260.05 | 0.00 | 0.00057 |
| [LH-DETAIL-M-02.html](../Lighthouse/LH-DETAIL-M-02.html) | mobile | 58 | 93 | 100 | 91 | 7958.61 | 8258.61 | 0.00 | 0.00059 |
| [LH-DETAIL-M-03.html](../Lighthouse/LH-DETAIL-M-03.html) | mobile | 58 | 93 | 100 | 91 | 7958.64 | 8258.64 | 0.00 | 0.00057 |

### Median theo nhóm (mô tả các file đã lưu)

| Nhóm | Số file | Median Performance | Median LCP (ms) |
|---|---:|---:|---:|
| CAT/mobile | 3 | 58 | 8259.55 |
| CAT/desktop | 3 | 89 | 1532.47 |
| DETAIL/mobile | 3 | 58 | 8258.64 |
| DETAIL/desktop | 3 | 89 | 1532.53 |

Nhóm median trên chỉ mô tả các report thực có. Catalog Mobile M-01 có trạng thái phiên chưa xác nhận; không gọi ba file này là ba lượt guest đồng nhất. Không tìm thấy M-04 trong thư mục đã đối chiếu. Không bắt buộc đo lại nếu báo cáo giữ rõ giới hạn này.

HTML cho thấy screenEmulation.disabled=true; formFactor là cấu hình audit, không đủ chứng minh viewport thực hoặc thiết bị điện thoại thật. Không dùng điểm Lighthouse làm phần trăm yêu cầu chức năng đạt. Các lượt là phép đo local với fixture nhẹ, không có SLA được chốt trước để gán Pass/Fail hiệu năng. Kiểm tra audit chỉ phản ánh trang được đo; chưa kết luận tốc độ toàn website.

## Responsive — phạm vi đã điều chỉnh

Người thực hiện đã chọn chỉ kiểm tra trang catalog. Minh chứng toolbar thể hiện viewport CSS 390×844; có ảnh danh sách, tìm kiếm và mở bộ lọc. Người thực hiện xác nhận sản phẩm trả đúng danh mục đã chọn và không phải vuốt ngang để sử dụng nút quan trọng. Đây là kết quả kiểm tra thủ công có xác nhận người thực hiện, không phải test responsive tự động.

| Phạm vi | Trạng thái đối chiếu | Minh chứng/giới hạn |
|---|---|---|
| Catalog 390×844: danh sách, tìm tên, chọn danh mục | Đã quan sát và người thực hiện xác nhận | Ba ảnh responsive trong Minh-chung/Doi-chieu; ảnh mở bộ lọc không tự chứng minh tập kết quả, phần này dựa xác nhận người thực hiện |
| Catalog 768×1024 và 1366×768 | Đã có ảnh toolbar đúng kích thước trong ZIP bổ sung | [Tablet](../Minh-chung/Responsive/RESP-CAT-768x1024.png), [desktop](../Minh-chung/Responsive/RESP-CAT-1366x768.png): layout và trạng thái tìm/lọc rỗng; chưa chứng minh mọi thao tác đều đạt |
| Responsive detail/login | Ngoài phạm vi sau điều chỉnh | Không gọi là đã kiểm thử |

Đầu trang trong ảnh mobile có nội dung không hiển thị đầy đủ. Chỉ ghi được xác nhận rằng các thao tác chính dùng được; không kết luận giao diện hoàn hảo hoặc toàn trang không tràn ngang.

Ảnh và dấu vết nguồn nằm trong [manifest](../Minh-chung/Doi-chieu/images-manifest.json); số liệu gốc trong [lighthouse-audit.json](../Minh-chung/Doi-chieu/lighthouse-audit.json).
