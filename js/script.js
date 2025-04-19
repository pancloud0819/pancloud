document.addEventListener("DOMContentLoaded", async () => {
  const categoryList = document.querySelectorAll("#categoryList li");
  const productList = document.getElementById("productList");
  const categoryTitle = document.getElementById("categoryTitle");

  let products = {};

  try {
    const response = await fetch("js/products.json");
    products = await response.json();
  } catch (error) {
    console.error("載入商品資料失敗", error);
    productList.innerHTML = "<p>商品資料載入失敗。</p>";
    return;
  }

  categoryList.forEach(item => {
    item.addEventListener("click", () => {
      const category = item.getAttribute("data-category");
      categoryTitle.textContent = category;

      const categoryProducts = products[category] || [];

      productList.innerHTML = "";

      if (categoryProducts.length === 0) {
        productList.innerHTML = "<p>此分類目前無商品。</p>";
        return;
      }

      categoryProducts.forEach(product => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
          <img src="images/${product.image}" alt="${product.name}" width="160" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        `;
        productList.appendChild(div);
      });
    });
  });
});
