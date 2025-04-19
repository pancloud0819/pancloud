function loadProducts(category) {
  fetch('js/products.json') // 修正路徑
    .then(response => response.json())
    .then(data => {
      const productList = document.getElementById('productList');
      productList.innerHTML = ''; // 清空原內容

      const products = data[category] || [];

      if (products.length === 0) {
        productList.innerHTML = '<p>此分類目前無商品。</p>';
        return;
      }

      products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <img src="images/${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        `;
        productList.appendChild(div);
      });
    })
    .catch(error => {
      console.error('載入商品失敗:', error);
      document.getElementById('productList').innerHTML = '<p>無法載入商品資料。</p>';
    });
}
