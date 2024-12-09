import axios from "axios";
import "./Table.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import PopEmploy from "./popEmploy";
import Swal from "sweetalert2";
import PopEditEmploy from "./popEditEmploy";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Table() {
  useEffect(() => {
    AOS.init({
        once: true,
        disable: "phone",
        duration: 800,
        easing: "ease-out-cubic",
    });
  }, [])
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState({})
  console.log('editUser: ', editUser);
  const [del, setDel] = useState('')
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/employees?populate=*")
      .then((res) => {
        const fetchedEmployees = res.data.data.map((employee) => ({
          ...employee,
          isEditing: false,
        }));
        setEmployees(fetchedEmployees);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
      });
  }, [del]);

  const handleSearchChange = (event) => {
    const val = event.target.value.toLowerCase();
    setSearchTerm(val);
  };

  const filteredEmployees = employees.filter((el) =>
    el.employee_Name?.toLowerCase().includes(searchTerm)
  );

  const handleEdit = (id) => {
    axios
      .get("http://localhost:1337/api/employees"+`/${id}`)
      .then((response) =>setEditUser(response.data.data))
  };

  const handleDelete = async (id) => {
    const deleteConfirmed = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the Employee`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (deleteConfirmed.isConfirmed) {
      try {
        // Optional: Show a loading state while deleting
        await axios.delete(`http://localhost:1337/api/Employees/${id}`);
        Swal.fire("Deleted!", "The Employee has been deleted.", "success");
        // Refresh the Employee list or update the state to reflect the deletion
        setEmployees((prev) => prev.filter((client) => client.id !== id));
        setDel(id)
      } catch (error) {
        console.error("Error deleting Employee:", error);
        Swal.fire("Error", "Failed to delete the Employee. Try again.", "error");
      }
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of employees per page
  
  // Assuming filteredEmployees is your employee data array
  const totalEmployees = filteredEmployees.length;

  // Calculate the current page's data
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <div className="search-table d-flex justify-content-between m-auto my-3 mt-5">
        <div className="group">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            placeholder="Search"
            type="search"
            className="input"
            onChange={handleSearchChange}
          />
        </div>
        <PopEmploy />
      </div>
      <div>
      <table className="col-12 text-center table">
        <thead>
          <tr className="color-tr">
            <th scope="col" className="col-1 t-img">Img</th>
            <th scope="col">Employee Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col" className="t-img">Salary</th>
            <th scope="col" className="col-1 w-houer">WorkHours</th>
            <th scope="col">Email</th>
            <th scope="col" className="col-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((el) => (
            <tr className="color-tr" key={el.documentId} data-aos="fade-down"data-aos-easing="linear"data-aos-duration="1000">
              <td width="5%" className="t-img">
                <div className="employee">
                  <img
                    src={`http://localhost:1337${el.employee_img?.[0]?.url}`}
                    alt={"avatar"}
                    className="w-100"
                  />
                </div>
              </td>
              <td className="pt-3">{el.employee_Name}</td>
              <td className="pt-3">{el.Phone_Number}</td>
              <td className="t-img pt-3">{el.Salary}</td>
              <td className="w-houer pt-3">{el.Work_hours}</td>
              <td className="overflow-hidden pt-3">{el.employee_Email}</td>
              <td width="5%" className="border-start">
                <div className="fw-semibold">
                  <button
                    className="text-primary text-decoration-none p-0 btn btn-link fw-bold"
                    onClick={() => handleEdit(el.documentId)}
                  >
                    <PopEditEmploy  
// @ts-ignore
                    userData={editUser}/>
                  </button>
                  <button
                    className="text-danger text-decoration-none px-1 btn btn-link fw-bold"
                    onClick={() => handleDelete(el.documentId)}
                  >
                    <i className="fa-regular fa-trash-can px-1 "></i><span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="col-10 m-auto">
        <div className="col-5 m-auto">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(totalEmployees / itemsPerPage)} // Calculate total number of pages
              page={currentPage} // Current page
              onChange={handlePageChange} // Handle page change
              color="primary"
            />
          </Stack>
        </div>
      </div>
    </div>
  </div>
  );
}
