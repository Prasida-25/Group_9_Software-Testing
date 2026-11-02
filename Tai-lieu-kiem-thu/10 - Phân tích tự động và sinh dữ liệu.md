## Bổ sung sau kiểm kê Screenshots.zip

Ảnh terminal người thực hiện tại [GEN-user-terminal-lint-skipped.png](../Minh-chung/Tu-dong/GEN-user-terminal-lint-skipped.png) thuộc run `2026-11-02T05-05-49-635Z`. Sinh dữ liệu vẫn 10/10 đạt (10.000 lượt), nhưng phần ESLint trả 5 cảnh báo `File ignored because outside of base path.` — cả 5 file không được phân tích trong lượt này. Không diễn giải `errors=0` của lượt này là mã đã qua lint.

Kết quả 0 error/3 cảnh báo regex ở phần trước thuộc run `2026-11-02T04-59-11-706Z`, đã đối chiếu lại static-analysis.json có ruleId/vị trí cụ thể. Dùng JSON của lượt đó làm minh chứng phân tích tĩnh; ảnh mới chỉ chứng minh sinh dữ liệu và sự cố cấu hình lint khi chạy lại. Chưa sửa harness hoặc chạy lại lint trong bước kiểm kê ảnh.

Đính chính hướng dẫn chụp: không kỳ vọng mọi lần chạy hiện tại đều ra 3 cảnh báo; phải đọc thông báo thực tế. Vấn đề mới theo dõi: TEST-LINT-BASE-001, cấu hình công cụ bỏ qua file khi tái lập từ vị trí chạy này. Đây không phải lỗi website.

---

# Phân tích và sinh kiểm thử tự động TechZone

## 1 Phạm vi và mục tiêu

Áp dụng kiến thức khóa3 theo ba phần: property-based testing, sinh đầu vào bất thường có kiểm soát và phân tích tĩnh. Bộ công cụ tách tại Cong-cu/automated-analysis, không cài thêm dependency vào website hoặc sửa mã website. Không khởi tạo ứng dụng, không kết nối database và không gửi request tải tới website.

Các hàm được gọi là quote, positiveInteger, variantProblem và parseCatalogQuery thật. Phân tích tĩnh đọc5file: cart-validation.js, checkout.js, cart-service.js, catalog-query.js và account-validation.js. Chưa phân tích mọi route/controller/repository hoặc toàn frontend.

## 2 Công cụ và cấu hình trước khi chạy

| Thành phần | Cấu hình |
| --- | --- |
| Runtime | Node.js v24.16.0 |
| Sinh dữ liệu | fast-check4.10.2, ghim trong package.json/package-lock.json riêng |
| Seed | 20261102 cho mỗi thuộc tính |
| Ngân sách | 1.000lần/thuộc tính;10thuộc tính ở phiên bản sau sửa oracle |
| Shrinking | fast-check check, endOnFailure=false; lưu counterexample và path nếu có |
| Phân tích tĩnh | ESLint10.14.0, CommonJS, ECMAScriptlatest, fix=false |
| Quy tắc | no-undef, no-unreachable, no-dupe-args, no-dupe-keys, no-constant-condition, no-unused-vars, eqeqeq, no-eval, no-implied-eval, no-control-regex |
| Tái lập | Giữ code bộ sinh, lockfile, seed, phiên bản công cụ và mã website tương ứng |

Nguồn công cụ: [fast-check runners và RunDetails](https://fast-check.dev/docs/core-blocks/runners/), [ESLint configuration](https://eslint.org/docs/latest/use/configure/configuration-files). Dùng fc.check để tự lưu kết quả, không chỉ bắt một exception của runner.

Đây là công cụ tương thích backendJavaScript. Không trình bày như đã chạy junit-quickcheck/Infer/AFL trên backendNode.js. PhầnFUZZ là sinh đầu vào tiêu cực theo miền, không phải coverage-guided fuzzing kiểuAFL, không phải quét bảo mật toànwebsite hoặc chứng minh không có lỗhổng.

## 3 Thuộc tính và oracle

### Miền giỏ hợp lệ

Sinh1–8dòng; giá1–1.000.000đơn vị0.01đ, quantity1–99, stock120, product/variant hợp lệ. Giá tối đa mỗi đơnvị là10.000đ. Tổng tiền hàng tối đa8×1.000.000×99=792.000.000đơn vị nhỏ, tương đương7.920.000đ, nằm dưới giới hạn tổng tiền của quote. Giỏ rỗng, giá cựcđại và overflow đã có thiết kế khác, không thuộc miềnPBT này.

Oracle tiền dùng giá sinh ở dạng số nguyên đơn vị0.01đ, tự cộng tích bằngBigInt. Không gọi priceUnits làm oracle của chính quote. Định dạng kết quả được đổi lại thành đơnvị nhỏ để so sánh chính xác.

| ID | Thuộc tính | Yêu cầu hoặc ý nghĩa |
| --- | --- | --- |
| PBT-01 | subtotal=Σgiá×quantity; phí0 nếusubtotal≥300.000đ, ngược lại30.000đ; total=subtotal+phí; input không bị sửa | REQ-PRICE-01/02/03, REQ-SHIP-01 |
| PBT-02 | Đảo thứ tự dòng không đổi subtotal/phí/total | Quan hệ biến hình của phép tính tổng; không kiểm tra thứ tự hiển thị |
| PBT-03 | Tăng quantity một đơn vị trong miền hợp lệ làm subtotal tăng đúng đơn giá | Kiểm tra phép nhân; không giả định total luôn tăng vì phí có thể được miễn khi vượt ngưỡng |
| PBT-04 | Tách quantity thành1 vàq−1 giữ subtotal/phí/total | Thuộc tính tính tiền tại hàm; không yêu cầu database cho phép hai dòng cùng biến thể |
| PBT-05 | Quantity1–99 không vượt kho được positiveInteger/variantProblem chấp nhận | REQ-CART-02 |
| PBT-06 | Quantity=stock+1 vớistock1–98 bị variantProblem từ chối | REQ-CART-02 |
| PBT-07 | Từ khóa toàn dấu cách, kể cả201–260ký tự thô, sau chuẩn hóa thành rỗng | Làm rõ yêu cầu độ dài sau chuẩn hóa và bổ sung sau khi sửa oracle |

Property-based testing tìm phản ví dụ trong miền sinh; chạy hữu hạn không phải chứng minh toán học cho toàn miền. Đảo thứ tự dòng chỉ kiểm tra một quan hệ cụ thể, không khẳng định mọi biến đổi đầu vào đều tương đương.

## 4 Sinh đầu vào bất thường có kiểm soát

| ID | Miền sinh không hợp lệ | Oracle |
| --- | --- | --- |
| FUZZ-01 | Quantity sốâm/0,100–100000, chuỗi thập phân, rỗng, null/undefined, array/object,1e1,+1,01, chuỗi giốngSQL | positiveInteger vớimax99 phảiThrow lỗi nghiệp vụstatus422 |
| FUZZ-02 | IDâm/0, trên2147483647, thiếu/sai kiểu/sai định dạng | positiveInteger mặc định phảiThrowstatus422 |
| FUZZ-03 | q201–260ký tựASCII không trắng nên vẫn quá dài sau chuẩn hóa; qdạngmảng; giáâm/min>max; sort sai; category0; NUL; q[] | parseCatalogQuery phảiThrowstatus400 |

Mỗi tổ hợp giới hạn kích thước và không có objectvòng, Proxy hoặc getter có tác dụng phụ. Không coi các chuỗi giốngSQL là phép thử SQLinjection đầy đủ vì bộ này không gọi database. Một số mẫu có thể được sinh nhiều lần;1.000lượt không đồng nghĩa1.000input duy nhất.

## 5 Phát hiện lần đầu và sửa kỳ vọng của test

Lần đầu có9thuộc tính. PBT-01 đến06 vàFUZZ-01/02đạt; FUZZ-03 thất bại ở lượt420, seed20261102, shrinking197bước. Phản ví dụ rút gọn là qgồm201dấu cách. Error: Missing expected exception.

Oracle ban đầu cho rằng mọi chuỗi qdài hơn200ký tự thô đều phải bị từ chối. Nhưng yêu cầu và mã hiện tại kiểm tra sau trim/gộp khoảng trắng:201dấu cách trở thành chuỗi rỗng, được xử lý như không tìm kiếm. Đây là **vấn đề miền sinh/oracle của test**, chưa phải lỗi sản phẩm.

Cách khắc phục chỉ ở bộ kiểm thử:

1. Giữ nguyên kết quả lần lỗi và bảnrun-before-oracle-fix.cjs để tái lập.
2. Với lớp qquá dài không hợp lệ, sinh201–260ký tự từa/b/Z/0, bảo đảm không bị rút ngắn bởi chuẩn hóa.
3. ThêmPBT-07 kiểm tra riêng chuỗi toàn dấu cách được chuẩn hóa vềrỗng.
4. Chạy lại với cùngseed và ngân sách1.000lượt/thuộc tính. Không sửa codeweb hoặc thay yêu cầu để làm testPass.

Đây là ví dụ phân loại phản ví dụ: công cụ giúp tìm dữ liệu sai kỳ vọng, nhưng người thực hiện vẫn cần đối chiếu yêu cầu để phân biệt lỗitest và lỗiwebsite.

## 6 Kết quả sau sửa oracle

Thư mục lần thành công đầu: Minh-chung/Tu-dong/run-2026-11-02T04-59-11-706Z. Tên thư mục dùngUTC; quy đổiUTC+7 khi ghi giờ địa phương. Lần lỗi trước đó: run-2026-11-02T04-58-36-839Z.

| Nhóm | Thuộc tính đạt | Lượt chạy thực tế sau sửa |
| --- | ---: | ---: |
| PBT-01 đến07 | 7/7 | 7.000 |
| FUZZ-01 đến03 | 3/3 | 3.000 |
| Tổng | 10/10 | 10.000 |

Mỗi thuộc tính1.000lượt, khôngskip và không bị gián đoạn trong kết quả sau sửa. Không tìm phản ví dụ trong lần này. Không cộng10.000lượt thành10.000TC nghiệp vụ hoặc lấy làm tỷ lệ bao phủ yêu cầu; không gánPass cho toàn59TC từ kết quảPBT.

## 7 Phân tích tĩnh và phân loại cảnh báo

ESLint chạy quaAPI lintText trên nội dung5file, không thực thi code và khôngfix. Đường dẫnảo trong cấu hình dùng để chọnrule; JSON lưu lại đường dẫn nguồn thực tương ứng. Cấu hình10rule là phạm vi có chủ đích, không phải fullsecurityaudit, symbolicexecution hoặc chứng minh đúngđắn toànchươngtrình.

Kết quả: **0error,3warning**.

| Vị trí nguồn ở lần chạy | Rule | Phân loại sau đọc ngữ cảnh |
| --- | --- | --- |
| src/utils/catalog-query.js:41 | no-control-regex | Regex chủ đích chặn ký tự điều khiển trong từ khóa sau chuẩn hóa; cảnh báo quy tắc đúng về mẫu ký tự, chưa có bằng chứng lỗi nghiệp vụ |
| src/utils/account-validation.js:28 | no-control-regex | Chặn ký tự điều khiển ở họ tên; chủ đích validation, chấp nhận trong phạm vi đánh giá này |
| src/utils/account-validation.js:60 | no-control-regex | Chặn ký tự điều khiển ở các trường địa chỉ; chủ đích validation, chấp nhận trong phạm vi đánh giá này |

Không xóa regex hoặc đổi rule thànhoff để làm báo cáo sạch. Không gọi tất cảwarning là bug hoặc tự gắn mức nghiêm trọng bảo mật. Nếu đánh giá lại theo chính sách lint khác cần giữ cấu hình và kết quả riêng.

0error chỉ có nghĩa không có vi phạm mứcerror của10rule đã bật trên5file. Nó không chứng minh không có lỗi SQL, racecondition, truy cập trái phép, XSS hoặc lỗi khác ngoài phạm vi cácrule.

## 8 Minh chứng và bảo toàn mã

- Cong-cu/automated-analysis/package.json vàpackage-lock.json: công cụ được ghim phiên bản.
- run.cjs: bộ sinh/oracle hiện tại; run-before-oracle-fix.cjs: bản kỳ vọng ban đầu để giải thích phát hiện.
- results.json: seed, sốlượt, skip, shrink, counterexample/path và thông tin kết quả.
- static-analysis.json: rule, thông báo, vị trí và mức độ của5file.
- console.txt của lần chạy sau sửa: kết quả hiển thị. Lầnđầu chưa có wrapper lưuconsole nhưng JSON vẫn giữ đầy đủ kết quả từngproperty.
- SHA256 trước/sau của5file được kiểm tra không đổi; gitstatus project không có thay đổi sau công việc.

Tái lập lần lỗi ban đầu dùng cùnglockfile,seed và run-before-oracle-fix.cjs. Không dùngcounterexamplePath của generator cũ cho generator mới vì miền sinh đã đổi. Với một dữ liệu cụ thể, có thể viết testhồiquy trực tiếp thay vì buộc chạy lại mọi shrink.

## 9 Người thực hiện chạy lại và chụp

Dependencies đã được cài riêng trên máy này. Chạy:

```powershell
node 'D:/Duong/Kiểm thử phần mềm/Cuối Kỳ/Cong-cu/automated-analysis/run.cjs'
```

Máy mới: vào thư mục Cong-cu/automated-analysis rồi npmci --ignore-scripts. Nếu di chuyểnwebsite, đặtTECHZONE_PROJECT thành đường dẫn mới; không đưa.env/mật khẩu vào bộ nộp. Không nộpnode_modules.

Chụp một hoặc haiảnh đủ các dòng PBT-01…07 vàFUZZ-01…03PASS, mỗi dòngruns1000/seed20261102, tổng10/10, STATIC_ANALYSIS5file/0error/3warning vàORIGINAL_SOURCE_UNCHANGEDtrue.

Tên gợi ý: AUTO-GEN-01-sinh-test.png vàAUTO-GEN-02-phan-tich-tinh.png, lưuMinh-chung/Tu-dong. Cảnh báo được giữ nguyên trên ảnh, không che để tạo kết quả“sạch”.

## 10 Nội dung đưa vào báo cáo và thuyết trình

Thiết kế: thuộc tính, miền sinh, giả định, seed, ngân sách, oracle vàrule. Thực thi: bảng10/10,10.000lượt và3warning. Đánh giá: lỗioracle ban đầu, cách sửa, giải thích warning và giới hạn hữu hạn.

“Em dùngfast-check sinh giỏhàng và đầu vào tiêu cực theo miền cógiớihạn. Ban đầu côngcụ tìm ra201dấucách làmtest thấtbại; đối chiếu yêu cầu cho thấy oracle đang sai vì hệthống chuẩn hóa trước khi đếm. Em sửa miền sinh, thêmthuộctính chuẩn hóa và chạy lại. Sau sửa,10thuộctính với10.000lượtđạt; ESLint có3cảnhbáo regex chủđích, không phải3bug đãxácnhận. Các kếtquả này không thay cho kiểmthửMySQL hoặc giao diện.”
