// 初始化購物車
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 商品數據
const products = [
  {
    id: 1,
    title: "高級螺絲起子組",
    category: "工具類",
    subcategory: "手持工具",
    price: 1200,
    image: "pancloud/images/product5.jpg",
    description: "專業級螺絲起子組，包含多種規格"
  },
  {
    id: 2,
    title: "無線電動起子",
    category: "工具類",
    subcategory: "電動起子",
    price: 2500,
    image: "pancloud/images/product2.jpg",
    description: "高效能無線電動起子，電池續航力強"
  },
  {
    id: 3,
    title: "雷射測距儀",
    category: "量測工具",
    subcategory: "雷射測距儀",
    price: 3500,
    image: "pancloud/images/product3.jpg",
    description: "精準雷射測距，最大測量距離50米"
  }
];

// 渲染商品函數
function renderProducts(filteredProducts) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="initial-message">
        <p>請從左側選擇商品分類</p>
      </div>
    `;
    return;
  }

  let html = '';
  filteredProducts.forEach(product => {
    html += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <h3>${product.title}</h3>
        <div class="price">NT$ ${product.price}</div>
        <button class="button" onclick="addToCart(${product.id})">加入詢價車</button>
      </div>
    `;
  });
  
  productGrid.innerHTML = html;
}

// 設置分類篩選
function setupCategoryFilters() {
  const subcategoryItems = document.querySelectorAll('.subcategory-list li');
  const showAllBtn = document.querySelector('.show-all-products');
  
  subcategoryItems.forEach(item => {
    item.addEventListener('click', function() {
      const category = this.dataset.category;
      const subcategory = this.dataset.subcategory;
      
      // 更新活躍狀態
      subcategoryItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      // 篩選商品
      const filtered = products.filter(p => 
        p.category === category && p.subcategory === subcategory
      );
      renderProducts(filtered);
    });
  });
  
  showAllBtn.addEventListener('click', function() {
    subcategoryItems.forEach(i => i.classList.remove('active'));
    renderProducts(products);
  });
}

// 更新購物車數量顯示
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // 顯示添加成功通知
  showNotification(`${product.title} 已加入詢價車`);
  
  if (document.getElementById('cartItems')) renderCart();
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  if (!cartItemsEl) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty-cart-message">您的購物車是空的</p>';
    return;
  }

  let html = '';
  
  cart.forEach(item => {
    html += `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" style="width:80px;height:80px;object-fit:contain">
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <div class="quantity-control">
            <button class="quantity-btn minus">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus">+</button>
          </div>
        </div>
        <button class="remove-btn">×</button>
      </div>
    `;
  });
  
  cartItemsEl.innerHTML = html;
}

function setupInquiryModal() {
  const modal = document.getElementById('inquiryModal');
  const inquiryBtn = document.querySelector('.inquiry-btn');
  
  if (!modal || !inquiryBtn) return;

  // 打開詢價表單
  inquiryBtn.addEventListener('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      showNotification('您的購物車是空的，無法詢價', 'error');
      return;
    }
    
    // 填充商品清單到顯示區域
    const inquiryItemsEl = document.getElementById('inquiryItems');
    inquiryItemsEl.innerHTML = cart.map(item => `
      <div class="inquiry-item">
        <span>${item.title}</span>
        <span>× ${item.quantity}</span>
      </div>
    `).join('');
    
    // 設置商品清單數據 (用於表單提交)
    document.getElementById('inquiryItemsData').value = 
      cart.map(item => `${item.title} (數量: ${item.quantity})`).join('\n');
    
    // 更新商品總數顯示
    document.getElementById('totalItems').textContent = 
      cart.reduce((total, item) => total + item.quantity, 0);
    
    // 顯示模態框
    modal.style.display = 'block';
  });

  // 關閉模態框
  function closeModal() {
    modal.style.display = 'none';
  }
  
  // 關閉按鈕事件
  document.querySelector('.close-modal')?.addEventListener('click', closeModal);
  document.querySelector('.cancel-btn')?.addEventListener('click', closeModal);
  
  // 點擊外部關閉
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // 表單提交處理
  document.getElementById('inquiryForm')?.addEventListener('submit', function() {
    // 清空購物車
    localStorage.removeItem('cart');
    cart = [];
    updateCartCount();
    renderCart();
    
    // 顯示成功通知
    showNotification('詢價已送出，我們將盡快與您聯繫！');
  });
}

// 顯示通知
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// 驗證電子郵件
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 頁面初始化
document.addEventListener('DOMContentLoaded', function() {
  // 只在商品頁面初始化商品相關功能
  if (document.getElementById('productGrid')) {
    renderProducts([]);
    setupCategoryFilters();
  }
  
  // 更新購物車數量
  updateCartCount();
  
  // 如果是購物車頁面，渲染購物車內容
  if (document.getElementById('cartItems')) {
    renderCart();
    setupInquiryModal();
    
    // 購物車頁面事件
    document.getElementById('cartItems').addEventListener('click', function(e) {
      const itemEl = e.target.closest('.cart-item');
      if (!itemEl) return;
      
      const itemId = parseInt(itemEl.dataset.id);
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const itemIndex = cart.findIndex(item => item.id === itemId);
      
      if (e.target.classList.contains('remove-btn')) {
        cart.splice(itemIndex, 1);
      } 
      else if (e.target.classList.contains('plus')) {
        cart[itemIndex].quantity += 1;
      }
      else if (e.target.classList.contains('minus') && cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  }
});

// 更新模態框處理函數，使用共用邏輯
function setupModal(modalId, openButtonSelector) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const openButton = document.querySelector(openButtonSelector);
  
  function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // 打開模態框
  if (openButton) {
    openButton.addEventListener('click', openModal);
  }

  // 關閉按鈕
  modal.querySelector('.close-modal')?.addEventListener('click', closeModal);
  
  // 點擊外部關閉
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  return { openModal, closeModal };
}

// 初始化所有模態框
document.addEventListener('DOMContentLoaded', function() {
  // 商品詳情模態框
  if (document.getElementById('productDetailModal')) {
    setupModal('productDetailModal', null);
    setupProductDetails();
  }
  
  // 詢價模態框
  if (document.getElementById('inquiryModal')) {
    setupInquiryModal();
  }
  
  // 其他初始化代碼...
});

// 商品詳情功能
function setupProductDetails() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  // 使用事件委託處理商品卡片點擊
  productGrid.addEventListener('click', function(e) {
    // 檢查是否點擊了商品卡片或其中的元素
    const productCard = e.target.closest('.product-card');
    const viewDetailBtn = e.target.closest('.button');
    
    if (!productCard || !viewDetailBtn) return;

    const productId = productCard.dataset.id ? parseInt(productCard.dataset.id) : null;
    if (!productId) return;

    showProductDetail(productId);
  });
}

function showProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productDetailModal');
  if (!modal) return;

  // 填充商品資訊
  document.getElementById('detailImage').src = product.image;
  document.getElementById('detailImage').alt = product.title;
  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailPrice').textContent = `NT$ ${product.price}`;
  document.getElementById('detailDescription').textContent = product.description;

  // 設置數量選擇器事件
  const quantityInput = modal.querySelector('.quantity-input');
  modal.querySelector('.minus').addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) quantityInput.value = currentValue - 1;
  });
  
  modal.querySelector('.plus').addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  // 設置加入購物車按鈕
  modal.querySelector('.add-to-cart-btn').onclick = function() {
    const quantity = parseInt(quantityInput.value);
    addToCart(productId, quantity);
    showNotification(`${product.title} × ${quantity} 已加入詢價車`);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // 顯示模態框
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// 更新 renderProducts 函數，確保商品卡片有 data-id 屬性
function renderProducts(filteredProducts) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  productGrid.innerHTML = filteredProducts.length === 0 ? `
    <div class="initial-message">
      <p>請從左側選擇商品分類</p>
    </div>
  ` : filteredProducts.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.title}" class="product-image">
      <h3>${product.title}</h3>
      <div class="price">NT$ ${product.price}</div>
      <button class="button">查看詳情</button>
    </div>
  `).join('');
}

// 商品詳情功能
function setupProductDetails() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  // 使用事件委託處理商品卡片點擊
  productGrid.addEventListener('click', function(e) {
    const productCard = e.target.closest('.product-card');
    if (!productCard) return;

    const productId = parseInt(productCard.dataset.id);
    if (!productId) return;

    showProductDetail(productId);
  });

  // 返回按鈕事件
  document.querySelector('.back-to-list')?.addEventListener('click', function() {
    document.getElementById('productDetailView').style.display = 'none';
    document.getElementById('productListView').style.display = 'block';
  });
}

function showProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // 切換視圖
  document.getElementById('productListView').style.display = 'none';
  const detailView = document.getElementById('productDetailView');
  detailView.style.display = 'block';

  // 填充商品資訊
  document.getElementById('detailImage').src = product.image;
  document.getElementById('detailImage').alt = product.title;
  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailPrice').textContent = `NT$ ${product.price}`;
  document.getElementById('detailDescription').textContent = product.description;

  // 設置數量選擇器
  const quantityInput = detailView.querySelector('.quantity-input');
  detailView.querySelector('.minus').addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) quantityInput.value = currentValue - 1;
  });
  
  detailView.querySelector('.plus').addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  // 設置加入購物車按鈕
  detailView.querySelector('.add-to-cart-btn').onclick = function() {
    const quantity = parseInt(quantityInput.value);
    addToCart(productId, quantity);
    showNotification(`${product.title} × ${quantity} 已加入詢價車`);
  };
}

// 更新 renderProducts 函數
function renderProducts(filteredProducts) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  productGrid.innerHTML = filteredProducts.length === 0 ? `
    <div class="initial-message">
      <p>請從左側選擇商品分類</p>
    </div>
  ` : filteredProducts.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.title}" class="product-image">
      <h3>${product.title}</h3>
      <div class="price">NT$ ${product.price}</div>
      <button class="button">查看詳情</button>
    </div>
  `).join('');
}

// 頁面初始化
document.addEventListener('DOMContentLoaded', function() {
  // 只在商品頁面初始化商品相關功能
  if (document.getElementById('productGrid')) {
    renderProducts([]);
    setupCategoryFilters();
    setupProductDetails(); // 確保這一行被調用
  }
  
  // 其他初始化代碼...
});
