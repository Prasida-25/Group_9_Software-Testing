# Kiểm thử HTTP TechZone bằng Postman

## Chuẩn bị

Collection14request và environment mẫu chưa có mật khẩu tại thư mụcPostman. Đây là web renderHTML, không phải bộRESTAPI tự đặt tên. Các endpoint thực tế có thể trảHTML, redirect303 hoặcJSON ở /cart/preview. Không mặc định request thành công phải trảJSON200.

Ứng dụng test riêng: http://127.0.0.1:56327. Đã khởi động lại và kiểm tra endpoint đọc sau khi ứng dụng cũ dừng. Tất cả kết nối trong launcher riêng hướng vềtechshop_test; không chạy collection trênnpmstart củawebsite. Không đổi.env để làmPostman.

Tài liệu chính thức về assertion và nơi xem kết quả: [Postman test scripts](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/).

1. DùngPostmanDesktop; nếu dùng bảnweb cần agent có thể truy cậplocalhost trên máy này, không dùngCloudAgent để gọi127.0.0.1.
2. Import TechZone-dot-01.postman_collection.json và TechZone-test.postman_environment.json.
3. Chọn environment TechZone isolated local test; xác minhbase_url đúngURLởtrên. Guard trong từngrequest chặnURLkhác; nếu server đổiport cần xác minh lại rồi cập nhật cấu hình, không tự trỏdatabasewebsite.
4. Tắt Automatically follow redirects cho cácrequest; collection đã cófollowRedirects=false nhưng cần kiểm traSettings thực tế củaPostman. Nếu giữ bật,303có thể thành200ởtrang đích làm assertion sai.
5. Trong cookie manager, xóa cookie của127.0.0.1 **trongPostman** trước khi bắt đầu từPM-01. Cookie củaPostman và trình duyệt là hai phiên riêng; đãlogout trênbrowser không đồng nghĩaPostman đãlogout.
6. Đợtđầu chạyPM-01 đến04, chưa cần mật khẩu. TrướcPM-06/07, điền test_password bằng mật khẩu của kháchtest0900000021 tronggiátrịlocal/current củaenvironment, đánh dấuSecret nếuUIhỗtrợ. Không dùng mật khẩuadmin0900000022.

Không gửi mật khẩu cho người hỗ trợ; không chụpBodyrequestđăngnhập hoặcConsolecócookie/token. Chỉ dùng bảnJSONmẫu nguyêngốc để đưa lênGitHub; khôngexportcollection/environmentđangdùng cógiátrị phiên hoặc mật khẩu. Nếu cầnexport kếtquả phải rà/loại secrettrước.

## Thứ tự thực hiện

| Request | Mong đợi | Nội dung |
| --- | ---: | --- |
| PM-01 | 303 | KháchGET/cart, Location=/login?returnTo=%2Fcart |
| PM-02 | 401 | KháchGET/cart/preview, JSONyêu cầuđăngnhập |
| PM-03 | 200 | Catalogfixture cóTai ngheUITest vàChuotUITest |
| PM-04 | 400 | Khoảnggiámin>max bị từchối |
| PM-05 | 200 | GET/login, lấyCSRFtừform |
| PM-06 | 401 | POST/login với mật khẩu sai; nhận thông báo chung |
| PM-07 | 303 | Loginđúng kháchtest, Location=/cart; sessionregenerate làmtoken cũ không dùng tiếp |
| PM-08 | 200 | GET/cart trongphiên đãđăngnhập |
| PM-09 | 200 | GETsảnphẩmfixture, lấyCSRFcho phiênmới |
| PM-10 | 422 | POSTthêmgiỏquantity0 vớiCSRFhợp lệ, bị từchối |
| PM-11 | 403 | POSTthêmgiỏ khôngCSRF, bị từchối |
| PM-12 | 403 | KháchtestGET/admin/orders, không có quyền |
| PM-13 | 303 | Logout cóCSRF, chuyển/login?loggedout=1 |
| PM-14 | 303 | Cookiephiên sau logout không vào được/cart |

Post-response script tự lấyCSRF từ cácform ởPM-05/06/09, lưu trongbiếncollection để dùngrequesttiếp theo. Không lấy token từgiỏtrống vì giỏtrống cóthể không cóformCSRF. Token saulogin phải lấy lại vìsessionđược tạo mới. PM-13xóabiếnCSRFkhilogout.

Cookiejar tự giữ vàgửicookiephiên; không tự thêm headerCookie bằngtay. Bodyđăngnhập vàform dùngx-www-form-urlencoded, không phảiJSONraw.

NếuPM-01trả200: kiểmtra tựtheoredirect hoặcPostman cònphiênđăngnhập. NếuPM-07trả403: kiểmtra đãchạyPM-05/06vàcookiejar/tokencùngphiên. Nếu401: kiểmtra mật khẩu của kháchtest, không thửsailặp nhiều lần vìcó ratelimit. Nếu422thayvì403ởcaCSRF: cần xem request cótokenvôýquaheader/bodykhông.

Chạy đúngthứtự; nếu requestđầutiênbịfail thì dừng chụpảnh, không giảđịnh cácrequestphụthuộcsauđóđãhợp lệ. Collectionkhôngclear/toàn bộgiỏ, khôngđặtđơn, khôngchuyển trạngtháiđơn; haiPOST/cart/itemsdựkiếnđều bịtừchối.

## Ảnh cần chụp theo từng đợt

ĐợtA, chưađăngnhập:

- PM-01: URL/method, status303, tabHeaders cho thấyLocation; tránhchụpSet-Cookie.
- PM-02: status401, JSONmessage vàTestResultsđạt.
- PM-03/04: cóthể dùngtổngkếtrunner đểminhchứng, khôngbắtbuộcảnhriêngmọirequest.

ĐợtB, sauchuẩnbịmậtkhẩulocal:

- PM-07: chỉURL,status303,LocationvàTestResults; ẩnBodyrequestchứamậtkhẩu.
- PM-10/11/12: kếtquả422/403/403 vàTestResults, chụpđạidiệnhoặctổngkết.
- PM-14 hoặc tổngkếtcollectionrunner có14request; kếtquảthựctếđượcghiriêngsauchạy.

TênảnhgợiýPM-01-khach-redirect.png, PM-02-preview-401.png, PM-03-run-summary.png. LưutạiMinh-chung/Postman. Khôngdựngảnhkếtquảtừlog hoặc gánPass trước khichạy.

## Trạng thái và giới hạn

Collectionmới ởtrạngthái **Not Run trongPostman**. ViệckiểmtracácGETbằngNodeđểxácnhậnURLkhôngthaythế kếtquảPostman. Chưa córunnerreport,tổngassertionhoặcPass14/14 đểghivàobáocáo.

Đợt1chưakiểmtraPostmanvềđặtCOD, hủyđơn/hoànkho, tokencheckoutlặp, quyềnchủsởhữuA/BhoặcthuCOD. Cácphầnđó cóthểbổsungđợtriêng,sửdụngfixturevàmôitruờngđãxácminh. Không lấy14requestnày đểkếtluậnđủmọiHTTPtest.
