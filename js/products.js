// ── Sale Configuration ──
const SALE_CONFIG = {
  enabled: true,
  startTime: '2026-06-24T23:59:00',
  endTime: '2026-06-25T23:59:00',
  discountPercent: 50
};

window.isSaleActive = false;

function initSaleSystem() {
  if (!SALE_CONFIG.enabled) return;
  
  const now = new Date();
  const start = new Date(SALE_CONFIG.startTime);
  const end = new Date(SALE_CONFIG.endTime);
  
  if (now >= start && now <= end) {
    window.isSaleActive = true;
    PRODUCTS.forEach(p => {
      if (!p.priceOld) {
        const originalPrice = parsePrice(p.price);
        // Giảm giá và làm tròn chẵn hàng nghìn
        const discountedPrice = Math.round((originalPrice * (1 - SALE_CONFIG.discountPercent / 100)) / 1000) * 1000;
        
        p.priceOld = p.price;
        p.price = formatPrice(discountedPrice);
        if (!p.badge || p.badge === 'Mới') p.badge = `Sale ${SALE_CONFIG.discountPercent}%`;
      }
    });
  }
}

// ── Reviews Data ──
const REVIEWS = {
  1: [
    { name: 'Nguyễn Thảo', stars: 5, date: '12/05/2025', content: 'Vòng đẹp lắm ạ, đeo đi biển rất hợp. Chất liệu nhẹ, không bị kích ứng da. Shop đóng gói cẩn thận, giao nhanh!' },
    { name: 'Minh Châu', stars: 5, date: '03/05/2025', content: 'Mình order cho bạn thân làm quà, bạn mình thích lắm. Hộp đựng xinh xắn, sản phẩm y hình.' },
    { name: 'Linh Phạm', stars: 4, date: '28/04/2025', content: 'Màu sắc đẹp hơn ngoài thực tế luôn. Dây chắc, charm không bị bong. Sẽ ủng hộ shop tiếp!' }
  ],
  2: [
    { name: 'Trần Hà', stars: 5, date: '10/05/2025', content: 'Solar là chiếc vòng yêu thích nhất của mình rồi! Màu vàng rất sang, đeo với váy trắng là chuẩn nhất.' },
    { name: 'Bảo Thy', stars: 5, date: '01/05/2025', content: 'Nhìn ảnh đã thích, cầm trực tiếp càng thích hơn. Shop tư vấn nhiệt tình, giao đúng hẹn.' },
    { name: 'Kim Ngân', stars: 4, date: '25/04/2025', content: 'Mình mua 2 cái tặng bạn bè đi du lịch. Ai cũng khen đẹp hỏi mua ở đâu. Giá rất ok!' }
  ],
  3: [
    { name: 'Phương Anh', stars: 5, date: '08/05/2025', content: 'Selene siêu xinh luôn ạ! Đeo đi biển Đà Nẵng được khen cả ngày. Cảm ơn shop!' },
    { name: 'Ngọc Hân', stars: 5, date: '29/04/2025', content: 'Chất lượng tốt, giá hợp lý. Mình thích cái charm lá cuộn rất độc đáo, không trùng với ai.' },
    { name: 'Mai Linh', stars: 4, date: '20/04/2025', content: 'Giao hàng hơi lâu nhưng sản phẩm rất ổn. Dây bền, đeo cả tuần chưa thấy phai màu.' }
  ],
  4: [
    { name: 'Quỳnh Như', stars: 5, date: '11/05/2025', content: 'Đá lapis xanh rất đẹp, nhìn sang trọng hơn nhiều so với giá tiền. Mình đã mua thêm cho mẹ!' }
  ],
  5: [
    { name: 'Hồng Nhung', stars: 5, date: '09/05/2025', content: 'Luna nhỏ nhắn dễ thương, đeo hằng ngày đi làm cũng được. Shop giao nhanh hơn dự kiến.' }
  ]
};

function renderReviews(productId) {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  const reviews = REVIEWS[productId] || [];
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <p class="review-content">"${r.content}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.name.charAt(0)}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
      </div>
    </div>
  `).join('');
}
const PRODUCTS = [
  {
    id: 1,
    name: 'Nora',
    sub: null,
    price: '59,000đ',
    priceOld: null,
    badge: 'Bán Chạy',
    rating: '★★★★★',
    ratingCount: '42 đánh giá',
    img: 'img/img1.png',
    imgFallback: 'img/img4.png',
    desc: 'Thiết kế vòng đeo bắp tay thời trang, dễ phối đồ • Phong cách biển với charm sao biển, vỏ sò, mặt trời,... cực trendy • Có thể tùy chọn charm chữ cái theo tên riêng • Chất liệu nhẹ, đeo thoải mái • Phù hợp chụp ảnh, đi biển, cafe, festival, du lịch,...',
    attrs: [
      { label: 'Chất Liệu', value: 'Ngọc trai biển tự nhiên, chỉ lụa cao cấp' },
      { label: 'Kích Thước', value: 'S / M / L (điều chỉnh được)' },
      { label: 'Màu Sắc', value: 'Vàng, Bạc' },
      { label: 'Xuất Xứ', value: 'Thủ công · Việt Nam' }
    ],
    imgs: [
      'img/img1.png',
      'img/img18.png',
      'img/img21.png'
    ]
  },
  {
    id: 2,
    name: 'Solar',
    sub: null,
    price: '75,000đ',
    priceOld: null,
    badge: 'Mới',
    rating: '★★★★★',
    ratingCount: '28 đánh giá',
    img: 'img/img6.png',
    imgFallback: 'img/img6.png',
    desc: 'Solar mang hơi thở của những rạn san hô nhiệt đới vào từng chi tiết. Kết hợp vỏ sò tự nhiên và mảnh san hô nhỏ với gam màu be ấm áp, chiếc vòng là người bạn đồng hành hoàn hảo cho những ngày biển hè.',
    attrs: [
      { label: 'Chất Liệu', value: 'Vàng 14k, đá quý' },
      { label: 'Kích Thước', value: 'Free size (điều chỉnh được)' },
      { label: 'Màu Sắc', value: 'Vàng 14k' },
      { label: 'Xuất Xứ', value: 'Thủ công · Việt Nam' }
    ],
    imgs: [
      'img/img6.png',
      'img/img20.png',
      'img/img21.png'
    ]
  },
  {
    id: 3,
    name: 'Selene',
    sub: null,
    price: '79,000đ',
    priceOld: null,
    badge: null,
    rating: '★★★★☆',
    ratingCount: '35 đánh giá',
    img: 'img/img3.png',
    imgFallback: 'img/img3.png',
    desc: 'Selene lấy cảm hứng từ những con sóng biển mạnh mẽ và cuồn cuộn. Đá biển xanh được mài nhẵn theo hình con sóng, kết hợp với dây bạc 925 tạo nên một tác phẩm trang sức vừa phóng khoáng vừa sang trọng.',
    attrs: [
      { label: 'Chất Liệu', value: 'Vàng 14k, bạc 925' },
      { label: 'Kích Thước', value: 'S / M / L' },
      { label: 'Màu Sắc', value: 'Bạc' },
      { label: 'Xuất Xứ', value: 'Thủ công · Việt Nam' }
    ],
    imgs: [
      'img/img3 .png',
      'img/img19.png',
      'img/img21.png'
    ]
  },
  {
    id: 4,
    name: 'Aura',
    sub: null,
    price: '59,000đ',
    priceOld: null,
    badge: 'Mới',
    rating: '★★★★★',
    ratingCount: '19 đánh giá',
    img: 'img/img8.png',
    imgFallback: 'img/img8.png',
    desc: 'Aura là vòng lớn là vòng nhỏ là tinh hoa của dòng Premium — được chế tác từ đá lapis lazuli thật sự quý hiếm với màu xanh đêm sâu thẳm như bầu trời sau hoàng hôn trên đại dương. Mỗi viên đá là một tác phẩm nghệ thuật độc nhất vô nhị.',
    attrs: [
      { label: 'Chất Liệu', value: 'Đá lapis lazuli tự nhiên, bạc' },
      { label: 'Kích Thước', value: 'Free size (điều chỉnh được)' },
      { label: 'Màu Sắc', value: 'Xanh lapis đậm' },
      { label: 'Xuất Xứ', value: 'Thủ công · Việt Nam' }
    ],
    imgs: [
      'img/img8.png',
      'img/img19.png',
      'img/img18.png'
    ]
  },
  {
    id: 5,
    name: 'Luna',
    sub: null,
    price: '59,000đ',
    priceOld: null,
    badge: 'Mới',
    rating: '★★★★★',
    ratingCount: '11 đánh giá',
    img: 'img/img7.png',
    imgFallback: 'img/img7.png',
    desc: 'Luna là vòng nhỏ là tinh hoa của dòng Premium — được chế tác từ đá lapis lazuli thật sự quý hiếm với màu xanh đêm sâu thẳm như bầu trời sau hoàng hôn trên đại dương. Mỗi viên đá là một tác phẩm nghệ thuật độc nhất vô nhị.',
    attrs: [
      { label: 'Chất Liệu', value: 'Đá lapis lazuli tự nhiên, vàng 14K' },
      { label: 'Kích Thước', value: 'S / M / L' },
      { label: 'Màu Sắc', value: 'Xanh lapis đậm' },
      { label: 'Xuất Xứ', value: 'Thủ công · Việt Nam' }
    ],
    imgs: [
      'img/img7.png',
      'img/img20.png',
      'img/img18.png'
    ]
  }
];

// ── Render Products ──
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card" onclick="showDetail(${p.id})" style="cursor:pointer;">
      <div class="product-img-wrap">
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
        <img
          src="${p.img}"
          alt="${p.name}"
          onerror="this.src='${p.imgFallback}'"
          loading="lazy"
        />
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-price-row">
          <div style="display:flex; align-items:baseline; gap:6px; flex-wrap:wrap;">
            <span class="product-price">${p.price}</span>
            ${p.priceOld ? `<span class="product-price-old" style="margin:0">${p.priceOld}</span>` : ''}
          </div>
          <div>
            <div class="product-rating">${p.rating}</div>
            <div style="font-size:.6rem;color:var(--gray-400);text-align:right;">${p.ratingCount}</div>
          </div>
        </div>
        <button
          class="btn-add-cart"
          onclick='event.stopPropagation(); addToCart(${JSON.stringify(p).replace(/'/g, "\\'")})'
        >
          <svg viewBox="0 0 24 24" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          Thêm Vào Giỏ Hàng
        </button>
      </div>
    </div>
  `).join('');
}

// ── Show Product Detail ──
function showDetail(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;

  // Fill detail fields
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-price').textContent = p.price;
  document.getElementById('detail-price-old').textContent = p.priceOld || '';
  document.getElementById('detail-stars').textContent = p.rating;
  document.getElementById('detail-rating-count').textContent = p.ratingCount;
  document.getElementById('detail-desc').textContent = p.desc;

  const badge = document.getElementById('detail-badge');
  badge.textContent = p.badge || '';

  // Main image
  const mainImg = document.getElementById('detail-img');
  mainImg.src = p.imgs[0];
  mainImg.onerror = () => { mainImg.src = p.imgFallback; };
  mainImg.alt = p.name;

  // Thumbnails
  const thumbs = document.getElementById('detail-thumbnails');
  thumbs.innerHTML = p.imgs.map((src, i) => `
    <img
      class="detail-thumb ${i === 0 ? 'active' : ''}"
      src="${src}"
      alt="${p.name} ${i + 1}"
      onerror="this.src='${p.imgFallback}'"
      onclick="switchDetailImg(this, '${src}')"
    />
  `).join('');

  // Attributes
  const attrs = document.getElementById('detail-attrs');
  attrs.innerHTML = p.attrs.map(a => `
    <div class="detail-attr">
      <span class="detail-attr-label">${a.label}</span>
      <span class="detail-attr-value">${a.value}</span>
    </div>
  `).join('');

  // Cart button
  document.getElementById('detail-btn-cart').onclick = () => addToCart(p);

  // Reviews
  renderReviews(p.id);

  showPage('product-detail');
}

function switchDetailImg(thumbEl, src) {
  document.getElementById('detail-img').src = src;
  document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
}

// ── Init on load ──
document.addEventListener('DOMContentLoaded', () => {
  initSaleSystem();
  renderProducts();
});
