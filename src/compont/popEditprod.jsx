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
import { useState } from "react";
import Swal from "sweetalert2";


export default function ResponsiveDialog({data}) {
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [productData, setProductData] = React.useState({
    imge: null,
    Product_Name: data.Product_Name,
    Product_qty: data.Product_qty,
    Product_Price: data.Product_Price,
    Product_descrption: data.Product_Descrption,
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Handle Dialog Open/Close
  const handleClickOpen = () => {
    setOpen(true);
    axios
      .get(`http://localhost:1337/api/products/${data.documentId}`)
      .then((response) => setEditUser(response.data.data))
      .catch((err) => console.error("Error fetching product for editing:", err));
      console.log('editUser: ', editUser);
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
  const handleSubmit = async (values) => {
    console.log('values: ', values);
    const { Product_Name, Product_qty, Product_Price, Product_descrption} = productData;
    const productEdit = {
      "data" : {
        "Product_Name" : Product_Name,
        "Product_qty" : Product_qty,
        "Product_Price" : Product_Price,
        "Product_descrption" : Product_descrption,
      }
    }
    // const formData = new FormData();
    // formData.append("data[image]", image);
    // formData.append("data[Product_Name]", Product_Name);
    // formData.append("data[Product_qty]", Product_qty);
    // formData.append("data[Product_Price]", Product_Price);
    // formData.append("data[Product_descrption]", Product_descrption);

    try {
      const response = await axios.put(`http://localhost:1337/api/products/${data.documentId}`, productEdit, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });
      console.log("product updated successfully:", response.data);
      setOpen(false);
      Swal.fire(
        'Success!',
        'Product updated successfully.',
       'success'
      )
    } catch (error) {
      console.error("Error updating product:", error?.response?.data || error.message);
      alert('There was an error while updating the product. Please try again.');
    }
  };
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        className='border-0 text-primary text-decoration-none px-2 btn btn-link fw-bold'>
        <span>Edit</span>
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
