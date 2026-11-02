# Kết quả kiểm thử HTTP bằng Apache JMeter

Ngày thực hiện: 02/11/2026 (UTC+7). Công cụ: Apache JMeter 5.6.3, chạy non-GUI.

## 1. Mục tiêu và phạm vi

Đo thời gian phản hồi, throughput và lỗi của ba thao tác đọc sản phẩm trên ứng dụng local tại `http://127.0.0.1:56327`. Dữ liệu thuộc môi trường kiểm thử riêng `techshop_test`; không thực hiện đặt hàng, sửa giỏ hoặc thay đổi dữ liệu nghiệp vụ trong kịch bản này.

JM-01: danh sách `/products?category_id=462`; JM-02: tìm kiếm `/products/search` với category_id=462 và q=Tai nghe UI Test; JM-03: chi tiết `/products/545`. Từ khóa được URL-encode.

## 2. Thiết kế và cấu hình

| Mức tải | Threads | Ramp-up (giây) | Loops | Request dự kiến |
|---|---:|---:|---:|---:|
| 1 người dùng | 1 | 1 | 10 | 30 |
| 5 người dùng | 5 | 10 | 10 | 150 |

Constant Timer 1.000 ms nằm dưới Thread Group, áp dụng trước mỗi request. Ba request chạy tuần tự theo thứ tự trong JMX: danh sách → chi tiết → tìm kiếm. Kiểm tra HTTP 200 và nội dung sản phẩm fixture bằng Response Assertion. Không tải tài nguyên nhúng; đây là đo HTTP, không phải thời gian render đầy đủ trên trình duyệt.

## 3. Kết quả tổng hợp

| Mức tải | Samples | Lỗi | Error % | Average (ms) | Median (ms) | P95 (ms) | Min (ms) | Max (ms) | Throughput (request/s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1user | 30 | 0 | 0.00% | 22.67 | 21.50 | 40.55 | 15 | 51 | 1.01 |
| 5users | 150 | 0 | 0.00% | 22.93 | 21.50 | 36.90 | 9 | 53 | 3.97 |

Số liệu lấy từ statistics.json trong dashboard; đã đối chiếu JTL: 30/30 và 150/150 sample có responseCode=200, success=true. Cấu hình JMX trong thư mục lượt chạy đã được kiểm tra threads, loops và timer. Không chạy lại để tạo bản tổng hợp này.

## 4. Kết quả từng thao tác

| Mức tải | Thao tác | Samples | Lỗi | Average (ms) | P95 (ms) |
|---|---|---:|---:|---:|---:|
| 1user | JM-01 Danh sach san pham | 10 | 0 | 27.00 | 51.00 |
| 1user | JM-02 Tim kiem san pham | 10 | 0 | 23.10 | 32.00 |
| 1user | JM-03 Chi tiet san pham | 10 | 0 | 17.90 | 21.00 |
| 5users | JM-01 Danh sach san pham | 50 | 0 | 24.60 | 34.90 |
| 5users | JM-02 Tim kiem san pham | 50 | 0 | 24.48 | 41.35 |
| 5users | JM-03 Chi tiet san pham | 50 | 0 | 19.70 | 34.15 |

## 5. Nhận xét và giới hạn

Không ghi nhận request thất bại trong hai lượt đo, tổng cộng 180 request. Average lần lượt 22,67 ms và 22,93 ms; chưa thấy tăng đáng kể trong tập mẫu này. P95 mức 5 người dùng thấp hơn mức 1 người dùng không chứng minh tải cao làm ứng dụng nhanh hơn: hai lượt ngắn, số mẫu khác nhau và có dao động/cache.

Throughput chịu ảnh hưởng của số thread, ramp-up, thời gian phản hồi và khoảng nghỉ 1 giây. Không diễn giải throughput này là công suất tối đa của server. Mỗi mức mới chạy một lượt; chưa đo tải cao, stress, độ bền hoặc tải ghi. JMeter và server cùng máy local, dữ liệu fixture nhẹ, ảnh placeholder và quảng cáo bị stub trong launcher kiểm thử; kết quả không đại diện môi trường triển khai thực tế.

APDEX 1,000 trong dashboard được tính với ngưỡng 500/1.500 ms. Đây là cấu hình dashboard, không phải SLA nghiệp vụ được chốt trước. Không kết luận đạt SLA thời gian từ chỉ số này. Kết luận phù hợp: hoàn thành phép đo tải nhẹ và không ghi nhận lỗi trong phạm vi đã chạy.

## 6. Sự cố khi chuẩn bị

Lượt chạy thử JM-02 ban đầu gặp URISyntaxException do khoảng trắng trong q chưa mã hóa. Đã tích URL Encode rồi chạy thử thành công trước hai lượt đo chính. Đây là lỗi cấu hình công cụ, không ghi thành lỗi website. Cảnh báo package scanning/Nashorn xuất hiện nhưng hai lượt đo hoàn tất và tạo được dashboard.

## 7. Minh chứng và cách xem lại

- Cấu hình và dữ liệu gốc: [thư mục lượt chạy](../Jmeter/TechZone-JMeter-20261102-190049).
- [Dashboard 1 người dùng](../Jmeter/TechZone-JMeter-20261102-190049/1user-dashboard/index.html).
- [Dashboard 5 người dùng](../Jmeter/TechZone-JMeter-20261102-190049/5users-dashboard/index.html).
- Giữ toàn bộ thư mục dashboard (HTML, JS, CSS...), JMX, JTL và log khi đưa lên GitHub. Tải về/mở index.html trên máy để xem dashboard.

- [JM-terminal.png](../Minh-chung/JMeter/JM-terminal.png)
- [JM-1user-overview.png](../Minh-chung/JMeter/JM-1user-overview.png)
- [JM-1user-statistics.png](../Minh-chung/JMeter/JM-1user-statistics.png)
- [JM-5users-overview.png](../Minh-chung/JMeter/JM-5users-overview.png)
- [JM-5users-statistics.png](../Minh-chung/JMeter/JM-5users-statistics.png)

## Ảnh bổ sung từ Screenshots.zip

Đã bổ sung ảnh người thực hiện vào nhóm minh chứng tương ứng. Tênảnh, nguồnZIP, nội dung vàgiới hạn được ghi tại [bảng kiểm kê](../Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md). Không tính ảnh như lượt thực thi mới; mutation phải đối chiếu đúng runID ghi trongảnh.
