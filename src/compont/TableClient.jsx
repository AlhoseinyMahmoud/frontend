import "./Table.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useState, useEffect } from "react";
import PopClient from "./popClient";
import Swal from "sweetalert2";
import PopEditClient from "./popEditClient";
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
  const [client, setClient] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [del, setDel] = useState('')
  const [edit, setEdit] = useState('')
  const [editUser, setEditUser] = useState({})
  console.log('editUser: ', editUser);
  const itemsPerPage = 6;
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/clients")
      .then((res) => {
        const fetchedClients = res.data.data.map((client) => ({
          id: client.id,
          documentId: client.documentId,
          Address: client.Address || "N/A",
          Client_Name: client.Client_Name || "Unknown",
          Phone_Number: client.Phone_Number || "N/A",
          Client_Email: client.Client_Email || "N/A",
        }));
        setClient(fetchedClients);
        setDel('')
        setEdit('')
        console.log('fetchedClients: ', fetchedClients);
      })
      
      .catch((err) => {
        console.error("Error fetching clients:", err);
      });
  }, [del, edit]);
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when searching
  };

  const filteredClients = client.filter((el) =>
    el.Client_Name.toLowerCase().includes(searchTerm)
  );

  const handleEdit = (id) => {
    axios
      .get("http://localhost:1337/api/clients"+`/${id}`)
      .then((response) =>setEditUser(response.data.data))
  };
  useEffect(() => {
    handleEdit ();
  }, []);

  const handleDelete = async (id) => {
    const deleteConfirmed = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the client`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (deleteConfirmed.isConfirmed) {
      try {
        // Optional: Show a loading state while deleting
        await axios.delete(`http://localhost:1337/api/clients/${id}`);
        Swal.fire("Deleted!", "The client has been deleted.", "success");
        // Refresh the client list or update the state to reflect the deletion
        setClient((prev) => prev.filter((client) => client.id !== id));
        setDel(id)
      } catch (error) {
        console.error("Error deleting client:", error);
        Swal.fire("Error", "Failed to delete the client. Try again.", "error");
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

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
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <PopClient />
      </div>
      <table className="col-12 text-center table">
        <thead>
          <tr className="color-tr">
            <th scope="col" className="col-1">ID</th>
            <th scope="col"  className="Address_client">Address</th>
            <th scope="col">Client Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Client Email</th>
            <th scope="col" className="col-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.map((el) => (
            <tr className="color-tr" key={el.documentId} data-aos="fade-down"data-aos-easing="linear"data-aos-duration="1000">
              <td className="pt-3">{el.id}</td>
              <td className="Address_client pt-3">{el.Address}</td>
              <td className="pt-3">{el.Client_Name}</td>
              <td className="pt-3">{el.Phone_Number}</td>
              <td className=" overflow-hidden pt-3">{el.Client_Email}</td>
              <td width="5%" className="border-start">
                <div className="fw-semibold">
                  <button
                    className="text-primary text-decoration-none p-0 btn btn-link fw-bold"
                    onClick={() => handleEdit(el.documentId)}
                  >
                    <PopEditClient data={editUser}/>
                  </button>
                  <button
                    className="text-danger text-decoration-none px-1 btn btn-link fw-bold"
                    onClick={() => handleDelete(el.documentId)}
                  >
                    <i className="fa-regular fa-trash-can px-1"></i><span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className=" col-10  m-auto">
        <div className=" col-5 m-auto">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(filteredClients.length / itemsPerPage)} // Dynamically calculate total pages
              page={currentPage} // Bind to current page
              onChange={handlePageChange} // Handle page change
              color="primary"
            />
          </Stack>
        </div>
      </div>
    </div>
  );
}
