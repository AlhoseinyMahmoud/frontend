import "./Table.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Table() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 800,
      easing: "ease-out-cubic",
    });
  }, []);

  const [invoice, setInvoice] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/fatoras")
      .then((res) => {
        const fetchedInvoice = res.data.data.map((invoice) => {
          const { Product_Name, Product_qty, Product_Price, Total_Price } = invoice || {};
          return {
            id: invoice.id,
            Product_Name: Product_Name || "N/A",
            Product_qty: Product_qty || "0",
            Product_Price: Product_Price || "0",
            Total_Price: Total_Price || "0",
          };
        });
        setInvoice(fetchedInvoice);
      })
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when searching
  };

  const filteredInvoice = invoice.filter((el) =>
    el.Product_Name.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoice = filteredInvoice.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total
  const totalAmount = filteredInvoice.reduce(
    (acc, curr) => acc + Number(curr.Total_Price),
    0
  );

  return (
    <div>
      {/* Search and Actions */}
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
      </div>

      {/* Table */}
      <table className="col-12 text-center table">
        <thead>
          <tr className="color-tr">
            <th scope="col">Product Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoice.length > 0 ? (
            currentInvoice.map((el) => (
              <tr
                className="color-tr"
                key={el.id}
                data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="1000"
              >
                <td className="Address_client pt-3">{el.Product_Name}</td>
                <td className="pt-3">{el.Product_qty}</td>
                <td className="pt-3">${el.Product_Price}</td>
                <td className="pt-3">${el.Total_Price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
        {currentInvoice.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="4" className="font-weight-bold text-muted">
                Total: ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Pagination */}
      <div className="col-10 m-auto">
        <div className="col-5 m-auto">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(filteredInvoice.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </div>
      </div>
    </div>
  );
}
