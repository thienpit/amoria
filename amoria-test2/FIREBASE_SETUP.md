# 🔧 Hướng Dẫn Khắc Phục Sự Cố Firebase

## ❌ Vấn Đề: Nút "Đặt Hàng" và "Đăng Ký" Không Hoạt Động

Nếu khi click nút này mà không có gì xảy ra, 99% vấn đề là **Firebase config chưa được cập nhật** hoặc **Firebase chưa được kết nối đúng**.

---

## ✅ Cách Khắc Phục (Chi Tiết Từng Bước)

### Bước 1: Mở Firebase Console

1. Truy cập: https://console.firebase.google.com/
2. **Chọn dự án** "Amoria" (hoặc dự án Firebase của bạn)
3. Nếu chưa có dự án, [tạo mới tại đây](#tạo-dự-án-firebase-mới)

### Bước 2: Lấy Firebase Config

1. Trong Firebase Console, click **biểu tượng bánh xe ⚙️** (Cài đặt Dự Án)
2. Scroll xuống tìm phần **"Firebase SDK Snippet"**
3. Chọn **tab "CDN"** (nếu chưa được chọn)
4. Bạn sẽ thấy một đoạn code như thế này:

```javascript
var firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "amoria-xxxxx.firebaseapp.com",
  projectId: "amoria-xxxxx",
  storageBucket: "amoria-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrs"
};
```

**Copy toàn bộ config này**

### Bước 3: Thay Đổi File `js/firebase-config.js`

1. Mở file **`js/firebase-config.js`** trong editor (VSCode, Sublime, v.v.)
2. Tìm đoạn code:

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

3. **Thay toàn bộ** bằng config từ Bước 2. Ví dụ:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "amoria-xxxxx.firebaseapp.com",
  projectId: "amoria-xxxxx",
  storageBucket: "amoria-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrs"
};
```

4. **Lưu file** (Ctrl+S hoặc Cmd+S)

### Bước 4: Refresh Trình Duyệt

1. Quay lại trình duyệt chạy web (http://localhost:3000 hoặc địa chỉ của bạn)
2. **Nhấn Ctrl+F5** (hoặc Cmd+Shift+R trên Mac) để **clear cache**
3. Làm mới trang

### Bước 5: Kiểm Tra Console

1. **Mở Developer Tools**: Nhấn **F12**
2. Chọn tab **Console**
3. Nếu có lỗi đỏ, ghi lại toàn bộ lỗi

**Lỗi phổ biến:**

- ❌ `firebase is not defined` → Firebase SDK chưa load (kiểm tra `index.html` dòng `<script src="https://www.gstatic.com/...">`)
- ❌ `INVALID_API_KEY` → Config API key sai
- ❌ `Cannot read property 'collection' of undefined` → Firebase chưa khởi tạo

### Bước 6: Test Đặt Hàng

1. Thêm sản phẩm vào giỏ hàng
2. Click **"Xác Nhận Đặt Hàng"**
3. Sẽ thấy:
   - ✅ Trang "Cảm Ơn" hiển thị (thành công!)
   - ❌ Alert có lỗi (chưa kết nối được)

### Bước 7: Kiểm Tra Firestore

1. Quay lại Firebase Console
2. Click **Firestore Database** (bên trái)
3. Kiểm tra Collection **"orders"** - nếu có dữ liệu là **thành công!** ✅

---

## ❓ Tạo Dự Án Firebase Mới

Nếu chưa có dự án Firebase:

1. Vào https://console.firebase.google.com/
2. Click **"Thêm Dự Án"** (Add Project)
3. Nhập tên: **Amoria**
4. Chọn **Tiếp Tục** → Bỏ chọn "Google Analytics" → **Tạo Dự Án**
5. Chờ tạo xong
6. Kích hoạt **Firestore Database**:
   - Click **Firestore Database** (bên trái)
   - Click **Tạo Cơ Sở Dữ Liệu**
   - Chọn vị trí: **asia-southeast1** (Đông Nam Á)
   - Chế độ: **Bắt Đầu Ở Chế Độ Test**
   - Click **Tạo**
7. Kích hoạt **Anonymous Authentication**:
   - Click **Authentication** (bên trái)
   - Click **Bắt Đầu**
   - Chọn **Anonymous** → **Kích Hoạt**
   - Click **Lưu**

Rồi quay lại **Bước 2** để lấy config.

---

## 🐛 Debug Lỗi Chi Tiết

Mở **Console (F12)** và nhập từng dòng để test:

```javascript
// Kiểm tra Firebase có load không
console.log(firebase);

// Kiểm tra Config
console.log(firebaseConfig);

// Kiểm tra Connection
console.log(firebase.firestore());

// Kiểm tra Collections có
db.collection('orders').get().then(snapshot => {
  console.log('Tổng đơn hàng:', snapshot.size);
  snapshot.forEach(doc => console.log(doc.data()));
});
```

---

## 📞 Liên Hệ Hỗ Trợ

Nếu vẫn gặp lỗi, kiểm tra:

1. **Mật khẩu Firebase** (config paste đúng không?)
2. **Firestore Rules** - có cho phép read/write không?
3. **Network** - có kết nối internet không?
4. **Browser** - Thử browser khác xem sao
5. **Hard Refresh** - Ctrl+F5, xoá cache

---

**Chúc thành công! 🎉**
