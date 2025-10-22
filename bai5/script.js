// ==================== LẤY PHẦN TỬ CẦN DÙNG ==================== //
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("errorMsg");
const productList = document.getElementById("product-list");

// ==================== 1️⃣ HÀM HIỂN THỊ SẢN PHẨM ==================== //
function renderProducts(products) {
  productList.innerHTML = ""; // Xóa danh sách cũ

  products.forEach((p) => {
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
      <h3 class="product-name">${p.name}</h3>
      <p>${p.desc}</p>
      <p class="price">Giá: ${p.price}₫</p>
      <img src="${p.image}" alt="${p.name}">
    `;
    productList.appendChild(item);
  });
}

// ==================== 2️⃣ HÀM LƯU DỮ LIỆU VÀO LOCALSTORAGE ==================== //
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// ==================== 3️⃣ HÀM LẤY DỮ LIỆU TỪ LOCALSTORAGE ==================== //
function loadProducts() {
  const data = localStorage.getItem("products");
  if (data) {
    return JSON.parse(data);
  } else {
    // Dữ liệu mẫu ban đầu
    const sample = [
      {
        name: "Trà sữa Matcha",
        desc: "Vị trà xanh thanh mát hòa quyện sữa béo ngậy.",
        price: "45000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4fTNT2Y23wXzq22_bb8XhDs1n7WIUNnHRTg&s",
      },
      {
        name: "Sinh tố Xoài",
        desc: "Sinh tố tự nhiên từ xoài tươi 100%, bổ sung vitamin C.",
        price: "40000",
        image:
          "https://dayphache.edu.vn/wp-content/uploads/2016/02/cach-lam-sinh-to-xoai-sua-dac.jpg",
      },
      {
        name: "Cà phê sữa đá",
        desc: "Hương vị Việt Nam đậm đà, đánh thức mọi giác quan.",
        price: "35000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd8kzkkHEXTVZIDM78fruM3eHRTNwB-qRfEw&s",
      },
    ];
    localStorage.setItem("products", JSON.stringify(sample));
    return sample;
  }
}

// ==================== 4️⃣ KHỞI TẠO ==================== //
let products = loadProducts();
renderProducts(products);

// ==================== 5️⃣ TÌM KIẾM SẢN PHẨM ==================== //
searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase().trim();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(keyword)
  );
  renderProducts(filtered);
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// ==================== 6️⃣ ẨN / HIỆN FORM ==================== //
addProductBtn.addEventListener("click", () => {
  addProductForm.classList.toggle("hidden");
  errorMsg.textContent = "";
});

cancelBtn.addEventListener("click", () => {
  addProductForm.classList.add("hidden");
  addProductForm.reset();
  errorMsg.textContent = "";
});

// ==================== 7️⃣ THÊM SẢN PHẨM MỚI ==================== //
addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("newName").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const desc = document.getElementById("newDesc").value.trim();
  const imageInput = document.getElementById("newImage");

  // Validate
  if (name === "" || price === "" || isNaN(price) || Number(price) <= 0) {
    errorMsg.textContent = "⚠️ Vui lòng nhập tên và giá hợp lệ!";
    return;
  }

  let imgURL = "https://via.placeholder.com/250x150?text=No+Image";

  // Nếu có file ảnh upload
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      imgURL = event.target.result;

      const newProduct = {
        name,
        price,
        desc,
        image: imgURL,
      };

      products.unshift(newProduct);
      saveProducts(products);
      renderProducts(products);

      addProductForm.reset();
      addProductForm.classList.add("hidden");
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    const newProduct = {
      name,
      price,
      desc,
      image: imgURL,
    };
    products.unshift(newProduct);
    saveProducts(products);
    renderProducts(products);

    addProductForm.reset();
    addProductForm.classList.add("hidden");
  }
});
