# LEEP

Không gian dành cho sinh viên: cẩm nang phát triển bản thân, quản lý sự kiện và xây dựng portfolio.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở địa chỉ được Vite hiển thị trong terminal. Bản MVP hiện có:

- Dashboard với thống kê, sự kiện, nhiệm vụ và cẩm nang nổi bật
- Quản lý sự kiện và form tạo sự kiện
- Cẩm nang sinh viên theo 5 nhóm chủ đề
- Portfolio cá nhân
- Tìm kiếm và giao diện responsive cho mobile
- Giao diện đăng nhập và đăng ký đồng bộ với thương hiệu LEEP, có kiểm tra email, mật khẩu và xác nhận mật khẩu

## Đăng nhập và đăng ký

Hai form hiện là bản xem thử UI, chưa kết nối dịch vụ xác thực. Gửi form sẽ kiểm tra dữ liệu và thông báo rõ rằng chưa đăng nhập hoặc tạo tài khoản. Thông tin đăng nhập không được lưu hoặc gửi đi. Nút **Trải nghiệm LEEP** mở dashboard hiện có; nút **Đăng nhập** trên dashboard quay lại màn hình tài khoản.
