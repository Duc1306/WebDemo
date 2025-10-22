// ==================== LẤY PHẦN TỬ ==================== //
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const priceFilter = document.getElementById("priceFilter");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("errorMsg");
const productList = document.getElementById("product-list");

// ==================== HÀM HIỂN THỊ ==================== //
function renderProducts(products) {
  productList.classList.add("fade-out");
  setTimeout(() => {
    productList.innerHTML = "";
    products.forEach((p, index) => {
      const item = document.createElement("div");
      item.className = "product-item fade-in";
      item.innerHTML = `
        <h3 class="product-name">${p.name}</h3>
        <p>${p.desc}</p>
        <p class="price">Giá: ${Number(p.price).toLocaleString()}₫</p>
        <img src="${p.image}" alt="${p.name}">
        <button class="delete-btn" data-index="${index}">🗑️ Xóa</button>
      `;
      productList.appendChild(item);
    });
    productList.classList.remove("fade-out");

    // Gắn sự kiện xóa sau khi render
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const index = e.target.dataset.index;
        await confirmDelete(index);
      });
    });
  }, 300);
}

// ==================== LOCALSTORAGE ==================== //
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function loadProducts() {
  const data = localStorage.getItem("products");
  return data ? JSON.parse(data) : null;
}

// ==================== FETCH JSON ==================== //
async function fetchDefaultProducts() {
  try {
    const res = await fetch("./products.json");
    const data = await res.json();
    localStorage.setItem("products", JSON.stringify(data));
    return data;
  } catch {
    return [
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
  }
}

// ==================== KHỞI TẠO ==================== //
let products = [];

(async function init() {
  const stored = loadProducts();
  if (stored) {
    products = stored;
  } else {
    products = await fetchDefaultProducts();
    saveProducts(products);
  }
  renderProducts(products);
})();

// ==================== TÌM KIẾM + LỌC ==================== //
function filterProducts() {
  const keyword = searchInput.value.toLowerCase().trim();
  const priceRange = priceFilter.value;

  let filtered = products.filter((p) =>
    p.name.toLowerCase().includes(keyword)
  );

  filtered = filtered.filter((p) => {
    const price = Number(p.price);
    if (priceRange === "low") return price < 40000;
    if (priceRange === "mid") return price >= 40000 && price <= 60000;
    if (priceRange === "high") return price > 60000;
    return true;
  });

  renderProducts(filtered);
}

searchBtn.addEventListener("click", filterProducts);
searchInput.addEventListener("keyup", (e) => e.key === "Enter" && filterProducts());
priceFilter.addEventListener("change", filterProducts);

// ==================== HIỆU ỨNG TRƯỢT FORM ==================== //
addProductBtn.addEventListener("click", () => {
  addProductForm.classList.toggle("show");
  errorMsg.textContent = "";
});

cancelBtn.addEventListener("click", () => {
  addProductForm.classList.remove("show");
  addProductForm.reset();
  errorMsg.textContent = "";
});

// ==================== THÊM SẢN PHẨM ==================== //
addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("newName").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const desc = document.getElementById("newDesc").value.trim();
  const imageInput = document.getElementById("newImage");

  if (!name || !price || isNaN(price) || Number(price) <= 0) {
    errorMsg.textContent = "⚠️ Vui lòng nhập tên và giá hợp lệ!";
    return;
  }
  if (desc.length < 5) {
    errorMsg.textContent = "⚠️ Mô tả quá ngắn!";
    return;
  }

  let imgURL = "https://via.placeholder.com/250x150?text=No+Image";

  const addNew = (imgSrc) => {
    const newProduct = { name, price, desc, image: imgSrc };
    products.unshift(newProduct);
    saveProducts(products);
    renderProducts(products);
    addProductForm.reset();
    addProductForm.classList.remove("show");
  };

  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (ev) => addNew(ev.target.result);
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    addNew(imgURL);
  }
});

// ==================== XÓA SẢN PHẨM ==================== //
async function confirmDelete(index) {
  const confirmed = await fakeAsyncConfirm(
    "Bạn có chắc muốn xóa sản phẩm này không?"
  );
  if (!confirmed) return;

  products.splice(index, 1);
  saveProducts(products);
  renderProducts(products);
}

// Hàm confirm giả lập async
function fakeAsyncConfirm(message) {
  return new Promise((resolve) => {
    const popup = document.createElement("div");
    popup.className = "popup-confirm";
    popup.innerHTML = `
      <div class="popup-content">
        <p>${message}</p>
        <button id="yesBtn">Có</button>
        <button id="noBtn">Không</button>
      </div>
    `;
    document.body.appendChild(popup);

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");

    yesBtn.onclick = async () => {
      popup.remove();
      await new Promise((r) => setTimeout(r, 1000)); // giả lập chờ xử lý async
      resolve(true);
    };
    noBtn.onclick = () => {
      popup.remove();
      resolve(false);
    };
  });
}
