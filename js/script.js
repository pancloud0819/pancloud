document.addEventListener('DOMContentLoaded', function() {
    // 調試確認DOM元素存在
    console.log('DOM已加載');
    const productList = document.getElementById('product-list');
    const categoryFilter = document.getElementById('category-filter');
    
    if (!productList) {
        console.error('錯誤: 找不到 #product-list 元素');
        return;
    }
    
    if (!categoryFilter) {
        console.warn('警告: 找不到 #category-filter 元素，將只顯示所有商品');
    }

    // 臨時商品數據 (當JSON文件不可用時作為備份)
    const fallbackProducts = [
        {
            id: 1,
            name: "示範商品1",
            price: 299,
            category: "電子產品",
            description: "這是第一個示範商品",
            image: "images/product1.jpg"
        },
        {
            id: 2,
            name: "示範商品2",
            price: 599,
            category: "家居用品",
            description: "這是第二個示範商品",
            image: "images/product2.jpg"
        }
    ];

    // 嘗試加載JSON數據
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) throw new Error('無法加載商品數據');
            return response.json();
        })
        .then(products => {
            console.log('成功加載商品數據:', products);
            displayProducts(products);
            if (categoryFilter) setupCategoryFilter(products);
        })
        .catch(error => {
            console.error('加載JSON失敗，使用備用數據:', error);
            displayProducts(fallbackProducts);
            if (categoryFilter) setupCategoryFilter(fallbackProducts);
        });

    function setupCategoryFilter(products) {
        // 獲取所有獨特類別
        const categories = [...new Set(products.map(p => p.category))];
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        categoryFilter.addEventListener('change', filterProducts);
        
        function filterProducts() {
            const category = categoryFilter.value;
            const filtered = category === 'all' 
                ? products 
                : products.filter(p => p.category === category);
            displayProducts(filtered);
        }
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        
        if (!products || products.length === 0) {
            productList.innerHTML = '<p>目前沒有商品</p>';
            return;
        }
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p>價格: $${product.price}</p>
                ${product.description ? `<p>${product.description}</p>` : ''}
            `;
            productList.appendChild(card);
        });
    }
});
