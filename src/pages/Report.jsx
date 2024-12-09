import { useState, useEffect } from "react";
import axios from "axios";
import Navagation from "../compont/Navagation";
import Navbar from "../compont/Navbar";
import './Report.css';
import { Dialog, Button, DialogActions, DialogContent, DialogTitle, TextField, Pagination } from "@mui/material";
import Swal from "sweetalert2";
import AOS from 'aos';
import 'aos/dist/aos.css';
export default function Report() {
  useEffect(() => {
    AOS.init({
        once: true,
        disable: "phone",
        duration: 800,
        easing: "ease-out-cubic",
    });
  }, [])
  const [open, setOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]); // Fetched products
  const [selectedProduct, setSelectedProduct] = useState(null); // For dialog actions
  const [cart, setCart] = useState([]); // Products added to the "Fatora"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalValue = cart.reduce((sum, item) => sum + item.Product_Price * item.quantity, 0);
  const tax = totalValue * 0.1;
  const invoiceValue = totalValue + tax;
  // Dialog handlers
  const handleClickOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setOpen(false);
  };

  const handleAddToCart = (quantity) => {
    if (selectedProduct) {
      setCart((prevCart) => [
        ...prevCart,
        {
          ...selectedProduct,
          quantity,
          total: selectedProduct.Product_Price * quantity,
        },
      ]);
    }
    handleClose();
  };

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/products?populate=*")
      .then((res) => {
        const fetchedProducts = res.data.data.map((product) => ({
          ...product,
          isEditing: false, // Add editing state per product
        }));
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Set the filtered products initially as all products
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);
  const addHoverEffectToLinks = () => {
    const list = document.querySelectorAll('.navigation li');
    const activeLink = function () {
        list.forEach(item => item.classList.remove("hovered"));
        this.classList.add('hovered');
    };
    list.forEach(item => item.addEventListener('mouseover', activeLink));

    // Cleanup function to remove event listeners on unmount
    return () => list.forEach(item => item.removeEventListener('mouseover', activeLink));
  };

  const setupToggleMenu = () => {
    const toggle = document.querySelector('.toggle');
    const navigation = document.querySelector('.navigation');
    const main = document.querySelector('.main');
    
    const handleToggle = () => {
        navigation.classList.toggle('hide');
        main.classList.toggle('navigation-hide');
    };

    if (toggle) {
        toggle.addEventListener('click', handleToggle);
    }

    // Cleanup function to remove event listener on unmount
    return () => {
        if (toggle) {
            toggle.removeEventListener('click', handleToggle);
        }
    };
  };

  useEffect(() => {
    const cleanupHoverEffect = addHoverEffectToLinks();
    const cleanupToggleMenu = setupToggleMenu();

    // Cleanup all event listeners on component unmount
    return () => {
        cleanupHoverEffect();
        cleanupToggleMenu();
    };
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate totals
  

  const handleSearch = (value) => {
    if (value.trim() === "") {
      setFilteredProducts(products); // Reset to original products
    } else {
      const searchResults = products.filter((product) =>
        product.Product_Name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(searchResults);
    }}
  return (
    <div className="container-fluid">
      <Navagation />
      <div className="main mt-4 rounded-5">
        <Navbar />
        <div className="section col-11 d-flex m-auto">
          {/* Left Section */}
          <section className="section-left col-8 p-3">
          <div className=" mb-3">
          <div className="group">
            <input
              placeholder="Search"
              type="search"
              className="input"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          </div>
            <div className="row col-12">
              {currentProducts.map((product) => (
                <div className="col-sm-3 mb-3 d-flex flex-wrap repo_card" key={product.id} data-aos="zoom-in-up">
                  <div className="card col-12 p-1">
                    <div className="card-body p-0 m-0">
                      <div className="mx-2 my-3">
                      <div className="card-media">
                        <img
                          src={`http://localhost:1337${product.Product_img?.[0]?.url}`}
                          alt={product.Product_Name || "Product"}
                          style={{ height: "100px" ,width: "100%" }}
                        />
                      </div>
                        <p className="card-text text-center f">
                          {product.Product_Name}
                        </p>
                        <p className="card-text text-center fw-bold">
                          <span className="fs-5">Price:</span> ${product.Product_Price}
                        </p>
                      </div>
                      <div className="d-flex align-items-center">
                        <Button variant="contained" color="primary" className=" rounded-2 w-75 m-auto mb-2" onClick={() => handleClickOpen(product)}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-10 pt-4 px-5 m-auto">
              <div className="col-12 m-auto">
                <Pagination
                  count={Math.ceil(filteredProducts.length / itemsPerPage)} // Total pages
                  page={currentPage} // Current page
                  onChange={handlePageChange} // Handle page change
                  color="primary"
                />
              </div>
            </div>
          </section>

          {/* Right Section */}
          <aside className="section-right bg-light col-4 p-3" data-aos="fade-left">
            <h4 className="bg-warning pt-2"><span className="px-3 mt-5">Fatora</span><hr /></h4>
            <table className="tables">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="tr-Qty">Qty</th>
                  <th>Price</th>
                  <th  className="tr-Qty">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Product_Name}</td>
                    <td className="tr-Qty">{item.quantity}</td>
                    <td>${item.Product_Price}</td>
                    <td  className="tr-Qty">${(item.Product_Price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
            <div>
              <p className="fw-bold">Total: ${totalValue.toFixed(2)}</p>
              <p className="fw-bold">Tax: ${tax.toFixed(2)}</p>
              <p className="fw-bold fs-5">Invoice Value: ${invoiceValue.toFixed(2)}</p>
            </div>
            <div className=" d-flex my-5">
            <div className="col-8">
                 <p className="text-nowrap fw-bold fs-5">Payment information</p>
                 <p className="text-nowrap " >Name:hoseiny mahmoud</p>
                </div>
                <div className="col-4 bg-warning color">.</div>
                
            </div>
            <div>
              <button className="btn btn-success w-100 rounded-2" onClick={(()=>{
                Swal.fire("success","Invoice added successfully", "success");
              })}
                >Add Invoice</button>
            </div>
          </aside>
        </div>
      </div>

      {/* Dialog for adding quantity */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Quantity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="quantity"
            label="Quantity"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: parseInt(e.target.value, 10) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={() => handleAddToCart(selectedProduct.quantity || 1)} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
