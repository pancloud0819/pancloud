// 增强版购物车功能
document.addEventListener('DOMContentLoaded', function() {
  // 调试：打印当前购物车
  console.log('初始购物车:', JSON.parse(localStorage.getItem('cart')));

  // 强制绑定所有按钮事件
  function bindAllEvents() {
    // 普通加入购物车
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.onclick = function() {
        const card = this.closest('.product-card');
        if (!card) return;
        
        const productId = parseInt(card.dataset.id);
        if (isNaN(productId)) return;
        
        addToCart(productId);
        alert('已添加商品');
      };
    });

    // 模态框加入购物车
    const modalBtn = document.querySelector('.modal-add-to-cart');
    if (modalBtn) {
      modalBtn.onclick = function() {
        const productId = parseInt(this.dataset.productId);
        const quantity = parseInt(document.querySelector('.modal-content .quantity-input').value) || 1;
        addToCart(productId, quantity);
      };
    }
  }

  // 初始化执行
  updateCartCount();
  bindAllEvents();
  if (document.getElementById('cartItems')) renderCart();
});

// 其他原有函数保持不变...