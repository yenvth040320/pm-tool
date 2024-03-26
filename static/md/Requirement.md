# Phiếu yêu cầu sản xuất

## Quản lý các phiếu yêu cầu trong 1 dự án

<img src="/images/md/req-list.png" >

### Thêm mới phiếu yêu cầu

- Bấm nút `+ Mới` để đi tới màn hình thêm mới phiếu yêu cầu

<img src="/images/md/req-add.png" >

<img src="/images/md/req-add-form.png" >

### Chỉnh sửa phiếu yêu cầu

<img src="/images/md/req-edit-1.png" >

- Form chỉnh sửa phiếu yêu cầu.

<img src="/images/md/req-edit-2.png" >

### Xóa phiếu yêu cầu

<img src="/images/md/req-delete.png" >

### Chi tiết phiếu yêu cầu

- Double click hoặc click vào tiêu đề của phiếu yêu cầu để đi đến chi tiết của phiếu yêu cầu đó.

<img src="/images/md/req-detail-overview.png" >

#### Tab thông tin tổng quan
- Hiển thị các thông tin tổng quan và trao đổi của dự án.

#### Tab phân tích
- Phân tích các màn hình và hạng mục bị ảnh hưởng khi thực hiện phiếu yêu cầu.
    - Thêm màn hình bị ảnh hưởng
    <img src="/images/md/req-detail-tab-analyst-add-screen.png" >
    <img src="/images/md/req-detail-tab-analyst-add-screen-modal.png" >
    - Nhập `Tại sao phải chọn chức năng này?` sau đó bấm nút `Lưu` để lưu các màn hình ảnh hưởng

#### Tab Estimate
- Estimate các công việc cho các màn hình theo từng công đoạn
    - Bấm vào nút `Bắt đầu ET`
    <img src="/images/md/req-detail-tab-et-start-et.png" >
    <img src="/images/md/req-detail-tab-et-start-et-2.png" >

    - Bấm nút `+` theo từng công đoạn để estimate công việc gồm: 
        - Tiêu đề 
        - Số POINT estimate
        - Ghi chú
    <img src="/images/md/req-detail-tab-et-start-et-3.png" >

    - Bấm nút `Lưu` để lưu lại dữ liệu vừa thay đổi

    - Những tài khoản có quyền phê duyệt Estimate ở màn `Nhân sự dự án` sẽ hiển thị nút `Phê duyệt` và `Phê duyệt tất cả`
    <img src="/images/md/req-detail-tab-et-approve-et.png" >
    <img src="/images/md/req-detail-tab-et-approve-et-all.png" >


#### Tab Schedule
###### Lên schedule cho các công việc đã estimate của dự án
- Bấm nút `Bắt đầu chỉnh sửa`
<img src="/images/md/req-detail-tab-schedule-start.png" >
<img src="/images/md/req-detail-tab-schedule-add-modal.png" >

- Double click vào row có màu nền để tiến hành cập nhật schedule
- Hiển thị modal để cập nhật:
    - Người thực hiện
    - Số giờ
    - Thời gian bắt đầu
    - Thời gian kết thúc


- Thiết định quan hệ để cập nhật schedule nhiều task cùng lúc
    - Nhấn nút `Bắt đầu thiết định quan hệ` hoặc nút `F2` trên bàn phím
    <img src="/images/md/req-detail-tab-schedule-set-wbs.png" >

    - Tick vào checkbox ở đầu hàng theo thứ tự lần lượt các công việc sau đó bấm nút `Hoàn thành quan hệ` hoặc nút `F2` trên bàn phím để hoàn thành thiết định quan hệ
    - Có thể bấm nút `X` ở cột WBS để hủy thiết lập WBS của task đó
    - WBS của task liền kề sẽ bằng ID của task làm trước đó
    - Bấm nút `Cập nhật` để lưu thay đổi

#### Tab Gantt Chart

- Hiển thị Gantt chart để theo dõi tiến độ của công việc trong dự án
- Màu đỏ là các task trễ deadline
- Click vào các task để đi đến màn hình chi tiết task đó

<img src="/images/md/req-detail-tab-gantt-chart.png" >