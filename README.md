# Amoria — Hệ Thống Bán Hàng & Quản Lý Đơn Hàng

Dự án web thương mại điện tử cho bộ sưu tập vòng tay Amoria với đầy đủ chức năng đặt hàng, đăng ký nhận thông tin và bảng quản trị admin.

## 🌟 Tính Năng

**Phía Khách Hàng:**
- 🛍️ Xem 5 sản phẩm cố định
- 🛒 Giỏ hàng (lưu local)
- 📦 Đặt hàng với thông tin giao hàng
- 💳 Thanh toán COD hoặc QR (Momo/VietQR)
- 📝 Đăng ký nhận thông tin (2 vị trí)
- 📋 Tra cứu đơn hàng theo mã hoặc SĐT

**Phía Admin:**
- 🔐 Xác thực bằng mật khẩu
- 📊 Thống kê số liệu (Đơn hàng, Đăng ký, Lượt xem)
- 📈 Bảng quản lý đơn hàng chi tiết
- 👥 Bảng quản lý đăng ký nhận tin
- 👁️ Bảng lượt truy cập web
- 📥 Xuất Excel từng bảng hoặc cả 3 cùng lúc
- 🗑️ Xoá dữ liệu

**Cloud Database:**
- ☁️ Firebase Firestore (lưu trữ đám mây)
- ⚡ Cập nhật thời gian thực
- 🔒 An toàn và đáng tin cậy

---

## 📚 Hướng Dẫn Sử Dụng Firebase

### Bước 1: Tạo Dự Án Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **"Thêm dự án"** (Add project)
3. Nhập tên: **Amoria** (hoặc tên khác)
4. Chọn **Tiếp tục** → Tắt Google Analytics (hoặc bật nếu muốn) → **Tạo dự án**
5. Chờ dự án được tạo xong

### Bước 2: Lấy Thông Tin Cấu Hình Firebase

1. Trong Firebase Console, click vào biểu tượng bánh xe ⚙️ → **Cài đặt Dự Án**
2. Scroll xuống phần **Firebase SDK Snippet**
3. Chọn **CDN** (nếu chưa được chọn)
4. Copy toàn bộ config object trong `firebaseConfig = { ... }`
5. Giữ lại thông tin này, bạn sẽ dùng ở Bước 4

### Bước 3: Kích Hoạt Firestore Database

1. Trong Firebase Console, click **Firestore Database** (trên menu bên trái)
2. Click **Tạo cơ sở dữ liệu**
3. Chọn vị trí gần nhất (ví dụ: **asia-southeast1** cho Đông Nam Á)
4. Chọn **Bắt đầu ở chế độ Test** (hoặc Production + Quy tắc bảo mật dưới)
5. Click **Tạo**

**Nếu chọn Production, hãy cập nhật Quy Tắc Bảo Mật:**

Đi đến tab **Quy tắc** trong Firestore, thay thế toàn bộ bằng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Sau đó lên **Authentication** (menu bên trái):
1. Click **Bắt đầu**
2. Chọn **Anonymous** → **Kích hoạt**
3. Click **Lưu**

### Bước 4: Cập Nhật Firebase Config

1. Mở file `js/firebase-config.js` trong dự án
2. Tìm dòng:sa
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Thay thế các giá trị `YOUR_*` bằng thông tin từ Bước 2:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "amoria-abc123.firebaseapp.com",
  projectId: "amoria-abc123",
  storageBucket: "amoria-abc123.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

4. Lưu file

### Bước 5: Kiểm Tra Kết Nối

1. Mở `index.html` trong trình duyệt
2. Mở **Developer Tools** (F12) → Tab **Console**
3. Đặt hàng thử nghiệm với thông tin:
   - Tên: Test
   - Email: test@example.com
   - SĐT: 0912345678
   - Địa chỉ: 123 Test Street

4. Quay lại Firebase Console → **Firestore** → Collection **orders**
5. Nếu thấy dữ liệu mới, kết nối thành công! ✅

### Bước 6: Truy Cập Admin

1. Mở `admin.html`
2. Nhập mật khẩu: **Amoria@123** (trong `admin.html`, tìm `ADMIN_PASSWORD = 'Amoria@123'`)
3. Xem dữ liệu từ Firebase hiển thị trong các bảng

---

## 🔧 Cấu Trúc Dữ Liệu Firebase

### Collection: **orders**
```
{
  ref: "MRV-123456",
  name: "Nguyễn Văn A",
  email: "abc@example.com",
  phone: "0912345678",
  address: "123 Đường ABC, Q.1, TP.HCM",
  products: "Nora x1, Solar x2",
  items: [{name: "Nora", price: "59,000đ", qty: 1, img: "..."}],
  total: "193,000đ",
  payment: "Tiền mặt (COD)",
  note: "Ghi chú thêm",
  timestamp: "18/6/2026 14:30:45"
}
```

### Collection: **subscriptions**
```
{
  name: "Nguyễn Thảo",
  phone: "0912345678",
  message: "Muốn nhận thông tin ưu đãi",
  source: "Trang Chủ",
  timestamp: "18/6/2026 10:15:30"
}
```

### Collection: **visits**
```
{
  device: "Di động",
  browser: "Chrome",
  screen: "1366x768",
  referrer: "Trực tiếp",
  timestamp: "18/6/2026 09:00:00"
}
```

---

## 🚀 Triển Khai (Deploy)

### Option 1: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option 2: GitHub Pages, Netlify, Vercel

Đơn giản upload toàn bộ file lên hosting dịch vụ của bạn.

---

## 🔐 Bảo Mật

- **Admin Password:** Thay đổi `ADMIN_PASSWORD` trong `admin.html`
- **Firebase Security:** Sử dụng Anonymous Authentication
- **HTTPS:** Luôn triển khai trên HTTPS

---

## 📝 Ghi Chú

- Giỏ hàng lưu ở **localStorage** (phía khách)
- Đơn hàng, đăng ký, lượt xem lưu ở **Firebase Firestore** (đám mây)
- Admin tự động làm mới dữ liệu mỗi 5 giây
- Hỗ trợ ngôn ngữ Việt Nam

---

## 👨‍💻 Hỗ Trợ

Nếu có lỗi, kiểm tra:
1. Console (F12) có thông báo lỗi không?
2. Firebase Config có đúng không?
3. Firestore Rules có cho phép đọc/ghi không?
4. Network tab có request đến Firebase không?

**Chúc bạn thành công! 🎉**
