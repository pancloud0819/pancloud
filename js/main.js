// 確保DOM完全加載
document.addEventListener('DOMContentLoaded', function() {
    // 調試確認元素存在
    console.log('初始化商品系統...');
    
    const productList = document.getElementById('product-list');
    const categoryFilter = document.getElementById('category-filter');
    
    if (!productList) {
        console.error('錯誤: 找不到 #product-list 元素');
        return;
    }

    // 備用商品數據 (當JSON加載失敗時使用)
    const fallbackProducts = [
        {
            id: 1,
            name: "雲端儲存基礎版",
            price: 299,
            category: "儲存",
            image: "images/1.jpg",
            description: "10GB雲端儲存空間"
        },
        {
            id: 2,
            name: "企業VPN方案",
            price: 599,
            category: "安全",
            image: "images/2.jpg",
            description: "專業級企業VPN服務"
        }
    ];

    // 嘗試加載商品數據
    loadProducts()
        .then(products => {
            displayProducts(products);
            if (categoryFilter) setupFilter(products);
        })
        .catch(error => {
            console.error('使用備用數據:', error);
            displayProducts(fallbackProducts);
            if (categoryFilter) setupFilter(fallbackProducts);
        });

    function loadProducts() {
        return fetch('data/products.json')
            .then(response => {
                if (!response.ok) throw new Error('網絡響應異常');
                return response.json();
            });
    }

    function setupFilter(products) {
        // 獲取所有獨特類別
        const categories = [...new Set(products.map(p => p.category))];
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        categoryFilter.addEventListener('change', () => {
            const category = categoryFilter.value;
            const filtered = category === 'all' 
                ? products 
                : products.filter(p => p.category === category);
            displayProducts(filtered);
        });
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        
        if (!products || products.length === 0) {
            productList.innerHTML = '<p class="no-products">暫無商品</p>';
            return;
        }
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <p class="desc">${product.description || ''}</p>
                <button class="cta-button">了解更多</button>
            `;
            productList.appendChild(card);
        });
    }
});
