import { useEffect, useState } from "react";
import Navagation from "../compont/Navagation";
import Navbar from "../compont/Navbar";
import Pop from "../compont/popProd";
import axios from "axios";
import "./Products.css";
import Swal from "sweetalert2";
import { Pagination, Stack } from "@mui/material";
import PopEditprod from "../compont/popEditprod";
import AOS from 'aos';
import 'aos/dist/aos.css';
export default function Products() {
  useEffect(() => {
    AOS.init({
        once: true,
        disable: "phone",
        duration: 800,
        easing: "ease-out-cubic",
    });
  }, [])
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Search results
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(10); // Items per page
  const [editUser, setEditUser] = useState({}); // User being edited

  // Determine current page's products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add hover effects to navigation
  const addHoverEffectToLinks = () => {
    const list = document.querySelectorAll(".navigation li");
    const activeLink = function () {
      list.forEach((item) => item.classList.remove("hovered"));
      this.classList.add("hovered");
    };
    list.forEach((item) => item.addEventListener("mouseover", activeLink));

    // Cleanup event listeners on unmount
    return () => list.forEach((item) => item.removeEventListener("mouseover", activeLink));
  };

  // Setup toggle menu
  const setupToggleMenu = () => {
    const toggle = document.querySelector(".toggle");
    const navigation = document.querySelector(".navigation");
    const main = document.querySelector(".main");

    const handleToggle = () => {
      navigation.classList.toggle("hide");
      main.classList.toggle("navigation-hide");
    };

    if (toggle) toggle.addEventListener("click", handleToggle);

    // Cleanup event listener on unmount
    return () => {
      if (toggle) toggle.removeEventListener("click", handleToggle);
    };
  };

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:1337/api/products?populate=*");
        const fetchedProducts = res.data.data.map((product) => ({
          ...product,
          isEditing: false,
        }));
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        Swal.fire("Error", "Failed to load products. Please try again.", "error");
      }
    };
    fetchProducts();
  }, []);

  // Handle hover effects and toggle menu
  useEffect(() => {
    const cleanupHoverEffect = addHoverEffectToLinks();
    const cleanupToggleMenu = setupToggleMenu();
    return () => {
      cleanupHoverEffect();
      cleanupToggleMenu();
    };
  }, []);

  // Edit product handler
  const handleEdit = (id) => {
    axios
      .get(`http://localhost:1337/api/clients/${id}`)
      .then((response) => setEditUser(response.data.data))
      .catch((err) => console.error("Error fetching product for editing:", err));
  };

  // Delete product handler
  const handleDelete = async (id, index) => {
    const deleteConfirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (deleteConfirmed.isConfirmed) {
      try {
        await axios.delete(`http://localhost:1337/api/products/${id}`);
        setFilteredProducts((prev) => prev.filter((_, idx) => idx !== index));
        setProducts((prev) => prev.filter((product) => product.id !== id));
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire("Error", "Failed to delete the product. Try again.", "error");
      }
    }
  };

  // Search handler
  const handleSearch = (value) => {
    if (value.trim() === "") {
      setFilteredProducts(products);
    } else {
      const searchResults = products.filter((product) =>
        product.Product_Name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(searchResults);
    }
  };

  return (
    <div className="container-fluid">
      <Navagation />
      <div className="main mt-4 rounded-5">
        <Navbar />
        <div className="search-table d-flex justify-content-between m-auto my-3 mt-5">
          <div className="group">
            <input
              placeholder="Search"
              type="search"
              className="input"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Pop />
        </div>
        <div className="card-section d-flex gap-4 justify-content-center">
          {currentProducts.map((product, index) => (
            <div className="card" key={product.documentId} data-aos="zoom-in-up">
              <div className="card-media">
                <img
                  src={
                    product.Product_img?.[0]?.formats?.thumbnail?.url
                      ? `http://localhost:1337${product.Product_img[0].formats.thumbnail.url}`
                      : "fallback-image-url.png"
                  }
                  alt={product.Product_Name || "Product"}
                  style={{ height: "100px", width: "100%" }}
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">{product.Product_Name || "Untitled"}</h3>
                <p className="card-qty">Quantity: {product.Product_qty || "0"}</p>
                <p className="card-description">
                  {product.Product_descrption || "No description"}
                </p>
              </div>
              <div className="card-actions">
                <PopEditprod data={product} />
                <button
                  onClick={() => handleDelete(product.documentId, index)}
                  className="but-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-10 pt-4 px-5 m-auto">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(filteredProducts.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, value) => paginate(value)}
              color="primary"
            />
          </Stack>
        </div>
      </div>
    </div>
  );
}
