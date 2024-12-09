import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from 'axios'; // Import axios for making requests
import Swal from 'sweetalert2';

export default function ResponsiveDialog() {
  const [open, setOpen] = React.useState(false);
  const [clientData, setClientData] = React.useState({
    Address: '',
    Client_Name: '',
    Phone_Number: '',
    Client_Email: '',
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setClientData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    const { Client_Name, Address, Phone_Number, Client_Email } = clientData;

    if (!Client_Name || !Address || !Phone_Number || !Client_Email) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("data[Client_Name]", Client_Name);
    formData.append("data[Address]", Address);
    formData.append("data[Phone_Number]", Phone_Number);
    formData.append("data[Client_Email]", Client_Email);

    try {
      console.log('FormData before sending:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await axios.post("http://localhost:1337/api/clients", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product added successfully:", response.data);
      setOpen(false);
      setClientData({
        Address: '',
        Client_Name: '',
        Phone_Number: '',
        Client_Email: '',
      });
      Swal.fire("ADDED!", "The client has been added.", "success");
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
        <DialogTitle id="responsive-dialog-title">{"Add Client?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <form className="row g-3">
              <div className="col-12">
                <label htmlFor="Address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="Address"
                  value={clientData.Address}
                  onChange={handleChange}
                  placeholder="1234 Main St"
                />
              </div>
              <div className="col-12">
                <label htmlFor="Client_Name" className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="Client_Name"
                  value={clientData.Client_Name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="Phone_Number" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="Phone_Number"
                  value={clientData.Phone_Number}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="Client_Email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="Client_Email"
                  value={clientData.Client_Email}
                  onChange={handleChange}
                />
              </div>
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleSubmit} autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
