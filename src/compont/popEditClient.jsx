import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

export default function AlertDialog({data}) {

  const [open, setOpen] = useState(false);
  const initialValues = data
  console.log('initialValues: ', initialValues);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    const { Client_Name, Address, Phone_Number, Client_Email } = values;
    const formData = new FormData();
    formData.append("data[Client_Name]", Client_Name);
    formData.append("data[Address]", Address);
    formData.append("data[Phone_Number]", Phone_Number);
    formData.append("data[Client_Email]", Client_Email);

    try {
      const response = await axios.put(`http://localhost:1337/api/clients/${data.documentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Client updated successfully:", response.data);
      setOpen(false); // Close the dialog after successful submission
    } catch (error) {
      console.error("Error updating client:", error?.response?.data || error.message);
      alert('There was an error while updating the client. Please try again.');
    }
  };

  const validationSchema = Yup.object({
    Client_Name: Yup.string().required("Client Name is required"),
    Address: Yup.string().required("Address is required"),
    Phone_Number: Yup.string().required("Phone Number is required"),
    Client_Email: Yup.string().email("Invalid email format").required("Email is required"),
  });

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        className='border-0 text-primary text-decoration-none px-2 btn btn-link fw-bold'>
        <i className="fa-regular fa-square-check px-1"></i>
        <span className='fw-bolder'>Edit</span>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit Client Information"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {() => (
                <Form className="row g-3">
                  <div className="col-12">
                    <label htmlFor="Address" className="form-label">Address</label>
                    <Field
                      type="text"
                      className="form-control"
                      id="Address"
                      name="Address"
                      placeholder="1234 Main St"
                    />
                    <ErrorMessage name="Address" component="div" className="text-danger" />
                  </div>
                  <div className="col-12">
                    <label htmlFor="Client_Name" className="form-label">Client Name</label>
                    <Field
                      type="text"
                      className="form-control"
                      id="Client_Name"
                      name="Client_Name"
                    />
                    <ErrorMessage name="Client_Name" component="div" className="text-danger" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="Phone_Number" className="form-label">Phone Number</label>
                    <Field
                      type="tel"
                      className="form-control"
                      id="Phone_Number"
                      name="Phone_Number"
                    />
                    <ErrorMessage name="Phone_Number" component="div" className="text-danger" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="Client_Email" className="form-label">Email</label>
                    <Field
                      type="email"
                      className="form-control"
                      id="Client_Email"
                      name="Client_Email"
                    />
                    <ErrorMessage name="Client_Email" component="div" className="text-danger" />
                  </div>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={(()=>{Swal.fire(
                      'Success!',
                        'Client edited successfully.',
                      'success'
                    )})} autoFocus>
                      Save
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
