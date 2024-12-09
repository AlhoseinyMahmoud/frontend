import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import Swal from "sweetalert2";

export default function ResponsiveDialog() {
  const [open, setOpen] = React.useState(false);
  const [productData, setProductData] = React.useState({
    image: null,
    Product_Name: "",
    Product_qty: "",
    Product_Price: "",
    Product_descrption: "",
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Handle Dialog Open/Close
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Log to ensure file is selected
    setProductData((prevData) => ({ ...prevData, image: file }));
  };

  // Handle Form Submit
  const handleSubmit = async () => {
    const { Product_Name, Product_qty, Product_descrption, Product_Price, image } = productData;

    if (!Product_Name || !Product_qty  || !Product_Price ||!Product_descrption || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("data[Product_Name]", Product_Name);
    formData.append("data[Product_qty]", Product_qty);
    formData.append("data[Product_Price]", Product_Price);
    formData.append("data[Product_descrption]", Product_descrption);
    formData.append("data[Product_img]", image);

    // Ensure image is attached before appending to formData
    if (image) {
      console.log("Image file:", image); // Log the image to ensure it's being captured
    } else {
      alert("No image selected!");
      return;
    }

    try {
      console.log("FormData before sending:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await axios.post("http://localhost:1337/api/products?populate=*", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product added successfully:", response.data);
      setOpen(false);
      setProductData({
        image: null, // Reset the image after submission
        Product_Name: "",
        Product_qty: "",
        Product_Price: "",
        Product_descrption: "",
      });
      Swal.fire("ADDED!", "The product has been added.", "success");
    } catch (error) {
      console.error("Error adding product:", error?.response?.data || error.message);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        className="bg-white border-0 text-dark fs-5 rounded-3 shadow-lg"
      >
        +
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Add Product?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <form className="row g-3" onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="col-md-12">
                <label htmlFor="inputimg" className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="formFile"
                  name="image"
                  onChange={handleFileChange}
                />
              </div>

              {/* Product Name */}
              <div className="col-md-12">
                <label htmlFor="Product_Name" className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="Product_Name"
                  name="Product_Name"
                  value={productData.Product_Name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Quantity */}
              <div className="col-6">
                <label htmlFor="Product_qty" className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  id="Product_qty"
                  name="Product_qty"
                  value={productData.Product_qty}
                  onChange={handleInputChange}
                  min="1" // Prevent negative values
                />
              </div>

              {/* Price */}
              <div className="col-6">
                <label htmlFor="Product_Price" className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="Product_Price"
                  name="Product_Price"
                  value={productData.Product_Price}
                  onChange={handleInputChange}
                  min="0.01" // Ensure positive price
                  step="0.01" // Decimal precision
                  required
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <label htmlFor="Product_descrption" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="Product_descrption"
                  name="Product_descrption"
                  value={productData.Product_descrption}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
