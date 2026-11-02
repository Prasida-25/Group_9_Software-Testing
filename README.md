# Đánh giá và kiểm thử chất lượng website TechZone



Bài tập lớn học phần **Đánh giá và kiểm định chất lượng phần mềm**. Đối tượng kiểm thử là **TechZone**, cửa hàng giả lập kinh doanh sản phẩm công nghệ và phụ kiện, xây dựng bằng **Node.js, Express, EJS, JavaScript và MySQL**.



Đề tài vận dụng kiến thức từ bốn khóa trong chương trình Software Testing and Automation của University of Minnesota: Introduction to Software Testing, Black-box and White-box Testing, Introduction to Automated Analysis, Web and Mobile Testing with Selenium; kết hợp các bài lab của học phần.



> **Sinh viên thực hiện:**



| **Mã sinh viên** | **Họ và tên**     | **Lớp**   |
|------------------|-------------------|-----------|
|     23010832     |  Trịnh Tùng Dương | K17_CNTT9 |



## Tài liệu bài nộp



- [Báo cáo PDF](Bao%20cao/B%C3%A1o%20c%C3%A1o%20nh%C3%B3m%209.pdf)

- [Mã nguồn hệ thống](Sourcecode/)

- [Tài liệu kiểm thử](Tai-lieu-kiem-thu/)

- [Minh chứng](Minh-chung/)



## 1. Mục tiêu và phạm vi



Mục tiêu là xác định kết quả mong đợi từ yêu cầu, thiết kế ca kiểm thử, thực hiện kiểm tra ở các tầng phù hợp và đánh giá chất lượng dựa trên bằng chứng.



| Nhóm | Nội dung kiểm thử sâu |
| Tài khoản | Đăng ký; đăng nhập bằng điện thoại và mật khẩu; đăng xuất |
| Sản phẩm | Danh sách; tìm kiếm; lọc; chi tiết và chọn biến thể |
| Giỏ hàng | Xem, thêm, gộp biến thể, cập nhật và xóa dòng của mình |
| Đặt COD | Chọn địa chỉ đã lưu; tính tiền/phí tại server; tạo đơn, trừ kho và giữ các dòng giỏ chưa đặt |
| Đơn mua | Xem danh sách, chi tiết và snapshot đơn của mình; kiểm tra quyền sở hữu |
| Quản trị đơn | Tra cứu; chuyển trạng thái; admin hủy đơn hợp lệ; xác nhận đã thu COD |



Phạm vi có **17 use case và một xử lý tự động AUTO-01**. Giữ nguyên mã UC-16 đến UC-18; UC-15 về khách tự hủy đã được loại khỏi phạm vi. Khách không có thao tác tự hủy đơn trong bài này.



Không kiểm thử sâu voucher, chuyển khoản, trả hàng, hoàn tiền, đánh giá sản phẩm, CRUD địa chỉ hoặc quản trị catalog. Responsive chỉ kiểm tra trang catalog. Các test có sẵn chạm chức năng phụ được ghi rõ trong kết quả, không tự mở rộng kết luận.



### Quy tắc nghiệp vụ chính



- Đăng nhập trước khi thêm giỏ và đặt hàng; danh tính lấy từ phiên đã xác thực.

- Mỗi dòng giỏ có số lượng nguyên từ 1–99 và không vượt tồn kho; thêm giỏ chưa trừ kho.

- Giá, tổng tiền và tồn kho lấy hoặc tính tại server. Với COD không voucher: tiền hàng dưới 300.000đ có phí 30.000đ; từ 300.000đ miễn phí.

- Đặt thành công lưu snapshot, trừ kho và xóa đúng các dòng đã đặt trong transaction.

- Admin chuyển `pending → confirmed → shipping → delivered`; ghi nhận thu COD là thao tác riêng sau giao hàng.

- Hủy hợp lệ bởi admin hoặc AUTO hoàn kho một lần. AUTO xét đơn COD `pending/unpaid` đủ 72 giờ theo thời gian MySQL; xử lý theo batch, có thể có độ trễ.



## 2. Thiết kế và phương pháp



| Phương pháp | Áp dụng | Hồ sơ |
| Hộp đen | Phân vùng tương đương, giá trị biên, bảng quyết định, chuyển trạng thái | [Thiết kế hộp đen](Tai-lieu-kiem-thu/01%20-%20Thi%E1%BA%BFt%20k%E1%BA%BF%20ki%E1%BB%83m%20th%E1%BB%AD%20h%E1%BB%99p%20%C4%91en.md) |
| Hộp trắng | CFG, đường cơ sở, độ phức tạp chu trình và coverage ở phần mã được chọn | [Thiết kế hộp trắng](Tai-lieu-kiem-thu/02%20-%20Thi%E1%BA%BFt%20k%E1%BA%BF%20ki%E1%BB%83m%20th%E1%BB%AD%20h%E1%BB%99p%20tr%E1%BA%AFng.md) |
| Unit và tích hợp | `node:test`, repository giả lập, HTTP và MySQL/InnoDB riêng | [Kết quả đợt 2](Tai-lieu-kiem-thu/05%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20%C4%91%C6%A1n%20v%E1%BB%8B%20v%C3%A0%20t%C3%ADch%20h%E1%BB%A3p.md) |
| BDD | Given/When/Then bằng Cucumber, fixture bộ nhớ | [Kết quả Cucumber](Tai-lieu-kiem-thu/07%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20h%C3%A0nh%20vi%20v%E1%BB%9Bi%20Cucumber.md) |
| Mutation | Chín thay đổi mục tiêu trên bản sao mã; bổ sung test từ mutant sống | [Ban đầu](Tai-lieu-kiem-thu/08%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20%C4%91%E1%BB%99t%20bi%E1%BA%BFn%20ban%20%C4%91%E1%BA%A7u.md), [sau bổ sung](Tai-lieu-kiem-thu/09%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20%C4%91%E1%BB%99t%20bi%E1%BA%BFn%20sau%20b%E1%BB%95%20sung.md) |
| Phân tích tự động | fast-check, quan hệ biến hình, dữ liệu bất thường và ESLint chọn lọc | [Kết quả và giới hạn](Tai-lieu-kiem-thu/10%20-%20Ph%C3%A2n%20t%C3%ADch%20t%E1%BB%B1%20%C4%91%E1%BB%99ng%20v%C3%A0%20sinh%20d%E1%BB%AF%20li%E1%BB%87u.md) |
| HTTP | Postman kiểm tra session, CSRF, validation và phân quyền | [Kết quả Postman](Tai-lieu-kiem-thu/11%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20HTTP%20v%E1%BB%9Bi%20Postman.md) |
| Giao diện | Selenium WebDriver thao tác trình duyệt với assertion | [Kết quả Selenium](Tai-lieu-kiem-thu/12%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20giao%20di%E1%BB%87n%20v%E1%BB%9Bi%20Selenium.md) |
| Chất lượng trang | Lighthouse và quan sát responsive | [Kết quả Lighthouse và responsive](Tai-lieu-kiem-thu/13%20-%20Lighthouse%20v%C3%A0%20giao%20di%E1%BB%87n%20responsive.md) |
| Tải HTTP | JMeter non-GUI, hai mức tải đọc sản phẩm | [Kết quả JMeter](Tai-lieu-kiem-thu/14%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20hi%E1%BB%87u%20n%C4%83ng%20v%E1%BB%9Bi%20JMeter.md) |



Các công cụ được chọn theo backend JavaScript. Bài sử dụng `node:test` và coverage của Node/V8, không chuyển website sang Java để chạy JUnit. Kiểm tra kích thước màn hình không đồng nghĩa kiểm thử ứng dụng mobile native.



## 3. Kết quả đã ghi nhận



| Bộ kiểm thử | Kết quả | Phạm vi cần phân biệt |
| Chín file unit/mock/HTTP có sẵn | **92/93 đạt, 1 Fail** | Một test quản trị dừng ở assertion câu đếm số đơn |
| Khóa 1 chạy riêng | **10/10 đạt** | 7 unit và 3 tích hợp mock; đã nằm trong bộ 93, không cộng thêm |
| Tích hợp MySQL/HTTP | **28/28 đạt** | Instance test riêng, cleanup PASS theo từng kịch bản |
| Hộp trắng | **28/28 đạt** | Coverage của ba file chọn trong lượt chạy đã lưu |
| Mutation | **8/9 bị diệt ban đầu; 9/9 sau bổ sung** | Baseline mở rộng 29/29; chín mutant mục tiêu |
| Cucumber | **12 scenario, 69 step đạt** | Fixture bộ nhớ |
| Sinh dữ liệu | **10/10 kiểm tra, 10.000 lượt đạt** | Seed 20261102, ngân sách hữu hạn |
| Postman | **14 request, 26 assertion đạt** | Gửi riêng từng request, có ảnh; chưa có Collection Runner report |
| Selenium | **6/6 đạt ở lượt cuối** | Đăng nhập đúng/sai, tìm kiếm, thêm giỏ, cập nhật, đăng xuất |
| JMeter | **30 + 150 request, không lỗi** | Hai mức tải nhẹ, một lượt mỗi mức |
| Lighthouse | **12 báo cáo HTML đã đối chiếu** | Catalog/detail × mobile/desktop × ba lượt; ghi rõ giới hạn phiên và viewport |



Không cộng các hàng thành một tỷ lệ Pass chung: số test, scenario, step, assertion và request là các đơn vị khác nhau, có nhiều hành vi trùng nhau.



### Coverage trong lượt hộp trắng



| File | Line % | Branch % | Function % |
| `cart-service.js` | 24.56 | 100.00 | 50.00 |
| `cart-validation.js` | 100.00 | 93.33 | 100.00 |
| `checkout.js` | 50.88 | 85.71 | 42.86 |
| **Tổng ba file** | **50.00** | **93.48** | **61.54** |



Đây không phải coverage toàn backend; line coverage không đồng nhất với statement coverage. Chưa chứng minh MC/DC hoặc mọi đường đi của hệ thống.



### Hai mức tải JMeter



Ba request GET gồm danh sách, tìm kiếm và chi tiết sản phẩm; nghỉ 1 giây trước mỗi request. Mỗi thread chạy 10 vòng. Ramp-up lần lượt 1 và 10 giây.



| Chỉ số | 1 thread | 5 threads |
| Samples | 30 | 150 |
| Lỗi | 0 | 0 |
| Average | 22,67 ms | 22,93 ms |
| Median | 21,50 ms | 21,50 ms |
| P95 | 40,55 ms | 36,90 ms |
| Throughput | 1,01 request/s | 3,97 request/s |



Kết quả mô tả tải HTTP nhẹ trên localhost với fixture nhỏ, không xác định tải tối đa hoặc thời gian render đầy đủ trong browser. Chưa có SLA thời gian được chốt để kết luận đạt SLA từ số liệu này.



## 4. Sai khác và giới hạn còn lại



| Nội dung | Kết luận hiện tại |
| Hiển thị giá “từ” | TC-CAT-01/use case mô tả chữ “từ” nhưng card chỉ có giá thấp nhất. Bảng REQ-PROD-04 chỉ quy định giá đại diện; cần thống nhất câu chữ trước khi phân loại/sửa. Không phải lỗi tính giá đã xác nhận. |
| Test quản trị Fail | Kỳ vọng câu “2 đơn hàng phù hợp” khác template; chưa sửa test. Assertion sau vị trí Fail chưa chạy. |
| ESLint khi chạy lại | Run `05-05-49` bỏ qua cả năm file vì `outside of base path`; không gọi lượt này là lint thành công. Run trước `04-59-11` có 0 error và 3 cảnh báo regex với vị trí cụ thể. Sinh dữ liệu vẫn 10/10 đạt. |
| AUTO | Có kiểm tra tuổi 71/73 giờ và quét lặp trên fixture; chưa exact 72 giờ, scheduler thực, batch 51 đơn, admin/AUTO chồng lấn InnoDB hoặc rollback AUTO đầy đủ. |
| Responsive | Có ảnh catalog 390×844, 768×1024, 1366×768. Kết quả thao tác được xác nhận ở mobile; hai viewport lớn hơn chưa chứng minh mọi thao tác đều đạt. |
| Lighthouse | Catalog M01 có trạng thái phiên chưa xác nhận; report có `screenEmulation.disabled=true`. Không gọi các file là ba lượt guest/viewport đồng nhất đã chứng minh. |



**Bộ thiết kế 59 ca chưa được chốt 59/59 Pass.** Đối chiếu hồi cứu ghi nhận 55 ca có bằng chứng một phần, 3 ca chưa có lượt đúng tình huống và 1 ca có sai khác mô tả. “Một phần” không đồng nghĩa test thất bại. Chi tiết tại [bảng truy vết](Tai-lieu-kiem-thu/15%20-%20%C4%90%E1%BB%91i%20chi%E1%BA%BFu%20ca%20ki%E1%BB%83m%20th%E1%BB%AD%20v%C3%A0%20minh%20ch%E1%BB%A9ng.md).



Các kiểm tra bổ sung chưa làm được đưa vào giới hạn/hướng phát triển trong báo cáo. Không dùng việc hoàn thành tài liệu để thay đổi kết quả thực tế.



## 5. Cài đặt và chạy website



### Yêu cầu cấu hình



- Node.js 24; lượt kiểm thử ghi nhận v24.16.0.

- MySQL 8.0; lượt tích hợp ghi nhận 8.0.46 và InnoDB.

- Chrome/ChromeDriver tương thích cho Selenium.

- Java và JMeter 5.6.3 cho đo tải; các lượt đã lưu dùng môi trường Windows.



Từ thư mục `Sourcecode` có `package.json`:



```powershell

npm ci

```



Nếu chưa có `.env`, tạo từ `.env.example` và điền cấu hình local: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` và `PORT` nếu cần. Không ghi đè cấu hình đang có hoặc đưa bí mật lên Git.



```powershell

npm start

```



Ứng dụng mặc định phục vụ tại `http://127.0.0.1:3000` hoặc cổng đã cấu hình. Các lượt UI/HTTP trong bài dùng launcher test ở `http://127.0.0.1:56327`; hai môi trường này cần được phân biệt.



Ứng dụng không tự tạo database hoặc nạp dữ liệu. DDL tham khảo nằm tại `database/techzone.sql`, có lệnh xóa bảng; không chạy như script khởi động/reset database đang sử dụng.



## 6. Chạy lại các bộ kiểm thử



### Unit và HTTP với dữ liệu giả lập



Tại thư mục `Sourcecode`:



```powershell

npm test

node --test tests/course1.test.js

```



`npm test` chạy `node --test tests/*.test.js`; không phải Selenium hoặc MySQL thật. Bộ đã lưu có một test Fail được giải thích ở mục 4, không cam kết lần chạy mới sẽ hoàn toàn xanh.



### Công cụ bổ sung



Các harness đang có đường dẫn mặc định của máy thực hiện. Khi chuyển máy/thư mục, khai báo rõ đường dẫn thay vì sửa mã website:



```powershell

# Điền đường dẫn thực trên máy chạy lại.

$projectDir = 'DUONG_DAN_THU_MUC_CHUA_PACKAGE_JSON_CUA_WEBSITE'

$artifactDir = 'DUONG_DAN_THU_MUC_CHUA_README_NAY'

$env:TECHZONE_PROJECT = $projectDir

```



Cài dependency của từng công cụ cần dùng bằng `npm ci --ignore-scripts` tại `Cong-cu/cucumber`, `Cong-cu/automated-analysis` hoặc `Cong-cu/selenium`. Mỗi thư mục có package/lockfile riêng; không cài các công cụ này vào dependency website chỉ để tái lập bài.



```powershell

# Hộp trắng: không cần ghi MySQL.

node --test "$artifactDir/Cong-cu/whitebox.test.cjs"



# Mutation: chỉ thay đổi bản sao mã trong vùng tạm.

node "$artifactDir/Cong-cu/mutation-check.cjs" --extended



# Cucumber: fixture trong bộ nhớ.

node "$artifactDir/Cong-cu/cucumber/run.cjs"



# Property/metamorphic/negative input và phân tích tĩnh chọn lọc.

node "$artifactDir/Cong-cu/automated-analysis/run.cjs"

```



Đọc thông báo ESLint thực tế khi chạy lại: `File ignored because outside of base path` nghĩa là file chưa được phân tích, dù số error bằng 0. Vấn đề này được giữ trong báo cáo, chưa sửa harness. Xem [hồ sơ phân tích tự động](Tai-lieu-kiem-thu/10%20-%20Ph%C3%A2n%20t%C3%ADch%20t%E1%BB%B1%20%C4%91%E1%BB%99ng%20v%C3%A0%20sinh%20d%E1%BB%AF%20li%E1%BB%87u.md).



### MySQL, UI và Selenium



Chỉ chạy các mục có ghi dữ liệu trên **instance test riêng đã xác minh**, dùng `techshop_test`. Cần cấu hình test local và quyền phù hợp theo `scripts/test-db-config.cjs`; không sử dụng thông tin truy cập database website. File `.env.test.local`, cấu hình quản trị instance và `.test-runtime` không nằm trong bộ công khai.



Khi môi trường test đã sẵn sàng, từ thư mục mã nguồn:



```powershell

node scripts/check-purchase-mysql.cjs --run

```



Launcher giao diện test tạo fixture và ghi manifest, nên chỉ khởi động sau khi đã xác minh đúng instance:



```powershell

$env:TECHZONE_TEST_PORT = '56327'

node "$artifactDir/Cong-cu/serve-ui-test.cjs"

```



Selenium hiện tham chiếu fixture cụ thể: sản phẩm 545, biến thể 1012, giá 100.000đ, tồn kho ít nhất 3 và manifest `Minh-chung/UI/server.json`. Khi tạo fixture mới trên máy khác, ID có thể đổi; cần đối chiếu/cập nhật harness và đường dẫn Chrome/driver trước khi chạy. Chưa có quy trình một lệnh bảo đảm tái lập nguyên trạng trên mọi máy.



Trong terminal khác, sau khi môi trường và fixture phù hợp:



```powershell

$env:TECHZONE_PROJECT = $projectDir

node "$artifactDir/Cong-cu/selenium/run.cjs"

```



### Postman, Lighthouse và JMeter



- **Postman:** import [collection](Postman/TechZone-dot-01.postman_collection.json) và [environment mẫu](Postman/TechZone-test.postman_environment.json). Theo [hướng dẫn](Postman/Huong-dan-Postman.md); nhập mật khẩu test chỉ ở máy local, kiểm tra `base_url`, cookie và thứ tự lấy CSRF.

- **Lighthouse:** xem các HTML trong [Lighthouse](Lighthouse) và [bảng đối chiếu](Tai-lieu-kiem-thu/13%20-%20Lighthouse%20v%C3%A0%20giao%20di%E1%BB%87n%20responsive.md). Nếu đo lại, ghi URL, phiên, thiết bị/cấu hình, thời điểm và các lần đo.

- **JMeter:** dùng [JMX một người dùng](Jmeter/TechZone-1user.jmx) hoặc [JMX năm người dùng](Jmeter/TechZone-5users.jmx). Kiểm tra server/port đang trỏ ứng dụng test trước khi chạy. Lượt chính chạy non-GUI, xuất JTL, log và dashboard riêng; hướng dẫn cùng giới hạn nằm trong [kết quả JMeter](Tai-lieu-kiem-thu/14%20-%20Ki%E1%BB%83m%20th%E1%BB%AD%20hi%E1%BB%87u%20n%C4%83ng%20v%E1%BB%9Bi%20JMeter.md).



Giữ toàn bộ thư mục dashboard JMeter để mở `index.html`; file HTML đơn lẻ thiếu JS/CSS có thể không hiển thị đúng. GitHub không trực tiếp chạy dashboard, nên tải về để mở trên máy. Kết quả gốc được lưu riêng với các lượt chạy lại.



## 7. Minh chứng và nguyên tắc bàn giao



- Log/JSON cho biết assertion và hậu điều kiện; ảnh gốc minh họa thao tác và kết quả quan sát được. Không dựng ảnh Pass từ log.

- Bản kiểm kê [Screenshots.zip](Minh-chung/Kiem-ke-Screenshots-zip/Ket-qua-kiem-ke.md) đã đối chiếu 74 ảnh, trong đó bổ sung 24 ảnh chưa được liên kết; giữ đường dẫn nguồn và SHA-256.

- Giữ các file nguồn kết quả cần thiết: JTL, JSON, báo cáo coverage, collection/JMX, HTML report và ảnh. Nếu `.gitignore` bỏ qua `*.log`, chỉ đưa log minh chứng đã rà soát vào bộ nộp; không đưa mọi log ứng dụng lên Git.

- Không công khai `.env`, mật khẩu, cookie, CSRF/token thực, cấu hình quản trị database, cache hoặc `node_modules`.

- Video được bổ sung sau khi báo cáo ổn định. Trước khi nộp, kiểm tra lại PDF, liên kết video và các đường dẫn minh chứng trên GitHub.



## Tài liệu tham khảo



- [University of Minnesota — Software Testing and Automation](https://www.coursera.org/specializations/software-testing-automation)

- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/)

- [Apache JMeter — Best Practices](https://jmeter.apache.org/usermanual/best-practices.html)

- [Chrome for Developers — Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)

