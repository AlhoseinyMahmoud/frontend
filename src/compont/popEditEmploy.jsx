import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AlertDialog({userData}) {
  console.log('userData: ', userData.id);
  const [employeeData, setEmployeeData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    setEmployeeData(userData)
  };

  const handleClose = () => {
    setOpen(false);
    setEmployeeData({})
  };
  

  const handleChange = (e) => {
    const { id, value} = e.target;
    setEmployeeData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    // @ts-ignore
    const { employee_Name, Phone_Number, Salary, Work_hours, employee_Email } = employeeData;
  
    // Validation
    if ( !employee_Name || !Phone_Number || !Salary || !Work_hours || !employee_Email) {
      alert('Please fill all fields.');
      return;
    }
  
    // const formData = new FormData();
    const data = {
      "data": {
        "employee_Name": employee_Name,
        "Phone_Number": Phone_Number,
        "Salary": Salary,
        "Work_hours": Work_hours,
        "employee_Email": employee_Email,
        }
    };
  
    // formData.append('data', JSON.stringify(data));
    // formData.append('files.employ_img', employ_img); // Use exact field name
  
    // Debug log
    // formData.forEach((value, key) => console.log(`${key}:`, value));
  
    try {
      const response = await axios.put(`http://localhost:1337/api/employees/${userData.documentId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Employee added successfully:', response.data);
  
      // Reset form and close dialog
      setOpen(false);
      setEmployeeData({
        employee_Name: '',
        Phone_Number: '',
        Salary: '',
        Work_hours: '',
        employee_Email: '',
      });
      Swal.fire(
        'Success!',
        'Employee edited successfully.',
       'success'
      )
    } catch (error) {
      console.error('Error adding employee:', error.response?.data || error.message);
      alert(`Failed to add employee. ${error.response?.data?.error?.message || 'Check console for details.'}`);
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} className=' border-0 text-primary text-decoration-none px-2 btn btn-link fw-bold'>
        <i className="fa-regular fa-square-check px-1"></i><span className='fw-bolder'>Edit</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-12">
                <label htmlFor="Employ_img" className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="employ_img"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="Employee_Email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="employee_Email"
                  // @ts-ignore
                  value={employeeData.employee_Email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="Employee_Name" className="form-label">Employee Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="employee_Name"
                  // @ts-ignore
                  value={employeeData.employee_Name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="Salary" className="form-label">Salary</label>
                <input
                  type="number"
                  className="form-control"
                  id="Salary"
                  // @ts-ignore
                  value={employeeData.Salary}
                  onChange={handleChange}
                  placeholder="5,000"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="Work_hours" className="form-label">Work Hours</label>
                <input
                  type="number"
                  className="form-control"
                  id="Work_hours"
                  // @ts-ignore
                  value={employeeData.Work_hours}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="Phone_Number" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="Phone_Number"
                  // @ts-ignore
                  value={employeeData.Phone_Number}
                  onChange={handleChange}
                />
              </div>
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
          <Button onClick={handleSubmit}  autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
