function loadProducts(category) {
  document.getElementById('categoryTitle').textContent = category;

  fetch('js/products.json')
    .then(response => response.json())
    .then(data => {
      const productList = document.getElementById('productList');
      productList.innerHTML = '';

      const products = data[category] || [];

      if (products.length === 0) {
        productList.innerHTML = '<p>此分類沒有商品。</p>';
        return;
      }

      products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <img src="images/${product.image}" alt="${product.name}" width="150"/>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        `;
        productList.appendChild(div);
      });
    })
    .catch(error => {
      console.error('載入失敗:', error);
      document.getElementById('productList').innerHTML = '<p>商品載入失敗。</p>';
    });
}
