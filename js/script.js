document.addEventListener("DOMContentLoaded", async () => {
  const categoryList = document.querySelectorAll(".category-list li");
  const productDetails = document.getElementById("product-details");

  try {
    const response = await fetch("js/products.json");
    const products = await response.json();

    categoryList.forEach(item => {
      item.addEventListener("click", () => {
        const category = item.getAttribute("data-category");
        const categoryProducts = products[category];

        productDetails.innerHTML = ""; // 清空原本內容

        if (categoryProducts && categoryProducts.length > 0) {
          categoryProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
              <img src="images/${product.image}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
            `;

            productDetails.appendChild(productCard);
          });
        } else {
          productDetails.innerHTML = "<p>此分類暫無商品。</p>";
        }
      });
    });
  } catch (error) {
    console.error("載入產品資料失敗：", error);
    productDetails.innerHTML = "<p>產品資料載入失敗。</p>";
  }
});
