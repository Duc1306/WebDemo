// Lấy các phần tử cần dùng
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const productList = document.getElementById("product-list");

// ==================== TÌM KIẾM SẢN PHẨM ==================== //
searchBtn.addEventListener("click", function() {
  const keyword = searchInput.value.toLowerCase().trim();
  const products = document.querySelectorAll(".product-item");

  products.forEach(item => {
    const name = item.querySelector(".product-name").textContent.toLowerCase();
    if (name.includes(keyword)) {
      item.style.display = ""; // hiện
    } else {
      item.style.display = "none"; // ẩn
    }
  });
});

// Cho phép nhấn Enter hoặc gõ trực tiếp
searchInput.addEventListener("keyup", function(e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// ==================== HIỆN / ẨN FORM THÊM SẢN PHẨM ==================== //
addProductBtn.addEventListener("click", function() {
  addProductForm.classList.toggle("hidden");
});

// ==================== THÊM SẢN PHẨM MỚI ==================== //
addProductForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const price = document.getElementById("price").value.trim();
  const image = document.getElementById("image").value.trim();

  if (!name || !desc || !price || !image) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Tạo phần tử sản phẩm mới
  const newProduct = document.createElement("article");
  newProduct.classList.add("product-item");
  newProduct.innerHTML = `
    <h3 class="product-name">${name}</h3>
    <p>${desc}</p>
    <p class="price">Giá: ${price}₫</p>
    <img src="${image}" alt="${name}">
  `;

  // Thêm vào danh sách
  productList.appendChild(newProduct);

  // Reset form
  addProductForm.reset();
  addProductForm.classList.add("hidden");
});
