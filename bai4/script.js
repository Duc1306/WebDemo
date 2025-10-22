// ==================== LẤY PHẦN TỬ CẦN DÙNG ==================== //
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("errorMsg");
const productList = document.getElementById("product-list");

// ==================== TÌM KIẾM SẢN PHẨM ==================== //
searchBtn.addEventListener("click", function () {
  const keyword = searchInput.value.toLowerCase().trim();
  const products = document.querySelectorAll(".product-item");

  products.forEach((item) => {
    const name = item.querySelector(".product-name").textContent.toLowerCase();
    if (name.includes(keyword) || keyword === "") {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
});

// Cho phép nhấn Enter để tìm
searchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// ==================== ẨN / HIỆN FORM ==================== //
addProductBtn.addEventListener("click", function () {
  addProductForm.classList.toggle("hidden");
  errorMsg.textContent = "";
});

cancelBtn.addEventListener("click", function () {
  addProductForm.classList.add("hidden");
  addProductForm.reset();
  errorMsg.textContent = "";
});

// ==================== THÊM SẢN PHẨM MỚI ==================== //
addProductForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("newName").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const desc = document.getElementById("newDesc").value.trim();
  const imageInput = document.getElementById("newImage");

  // ===== Validate =====
  if (name === "" || price === "" || isNaN(price) || Number(price) <= 0) {
    errorMsg.textContent = "⚠️ Vui lòng nhập tên và giá hợp lệ!";
    return;
  }

  if (desc.length < 5) {
    errorMsg.textContent = "⚠️ Mô tả quá ngắn!";
    return;
  }

  errorMsg.textContent = ""; // clear lỗi

  // ===== Tạo phần tử sản phẩm =====
  const newItem = document.createElement("div");
  newItem.className = "product-item";

  // ===== Xử lý ảnh =====
  let imgURL = "https://via.placeholder.com/250x150?text=No+Image"; // ảnh mặc định

  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      imgURL = event.target.result;

      newItem.innerHTML = `
        <h3 class="product-name">${name}</h3>
        <p>${desc}</p>
        <p class="price">Giá: ${price}₫</p>
        <img src="${imgURL}" alt="${name}">
      `;
      productList.prepend(newItem); // thêm lên đầu
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    // Nếu không chọn ảnh thì thêm ngay
    newItem.innerHTML = `
      <h3 class="product-name">${name}</h3>
      <p>${desc}</p>
      <p class="price">Giá: ${price}₫</p>
      <img src="${imgURL}" alt="${name}">
    `;
    productList.prepend(newItem);
  }

  // Reset form + ẩn
  addProductForm.reset();
  addProductForm.classList.add("hidden");
});
