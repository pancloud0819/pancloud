// 初始化購物車
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 商品數據 - 確保圖片路徑正確
const products = [
  {
    id: 1,
    title: "高級螺絲起子組",
    category: "工具類",
    subcategory: "手持工具",
    price: 1200,
    image: "images/product5.jpg", // 確認此圖片存在
    description: "專業級螺絲起子組，包含多種規格"
  },
  {
    id: 2,
    title: "無線電動起子",
    category: "工具類",
    subcategory: "電動起子",
    price: 2500,
    image: "images/product2.jpg", // 確認此圖片存在
    description: "高效能無線電動起子，電池續航力強"
  },
  {
    id: 3,
    title: "雷射測距儀",
    category: "量測工具",
    subcategory: "雷射測距儀",
    price: 3500,
    image: "images/product3.jpg", // 確認此圖片存在
    description: "精準雷射測距，最大測量距離50米"
  }
];

// 渲染商品函數 - 修正版
function renderProducts(filteredProducts) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  productGrid.innerHTML = filteredProducts.length === 0 
    ? `<div class="initial-message"><p>沒有找到商品</p></div>`
    : filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}" class="product-image">
          <h3>${product.title}</h3>
          <div class="price">NT$ ${product.price}</div>
          <button class="button" onclick="addToCart(${product.id})">加入詢價車</button>
        </div>
      `).join('');
}

// 設置分類篩選 - 修正版
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
  
  if (showAllBtn) {
    showAllBtn.addEventListener('click', function() {
      subcategoryItems.forEach(i => i.classList.remove('active'));
      renderProducts(products);
    });
  }
}

// 頁面初始化
document.addEventListener('DOMContentLoaded', function() {
  // 只在商品頁面初始化商品相關功能
  if (document.getElementById('productGrid')) {
    // 初始顯示空白或全部商品
    renderProducts([]); // 或 renderProducts(products) 顯示所有商品
    setupCategoryFilters();
  }
  
  // 更新購物車數量
  updateCartCount();
});
