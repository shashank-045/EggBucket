import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, RotateCcw, Edit } from "lucide-react";

const OrderDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("Date");
  const [outletFilter, setOutletFilter] = useState("Outlet");
  const [customerFilter, setCustomerFilter] = useState("Customer");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [orders, setOrders] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch the list of outlets
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:3577/egg-bucket-b2b/get-all-outlets"
        );
        const data = await response.json();
        if (data.status === "success") {
          setOutlets(data.data); // Store the data in the state
        }
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };

    fetchOutlets();
  }, []);

  // Fetch the list of customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:3577/customers/egg-bucket-b2b/getAllCustomer"
        );
        const data = await response.json();
        if (data) {
          setCustomers(data); // Store the data in the state
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Fetch the list of orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:3577/orders/egg-bucket-b2b/getAllOrder"
        );
        const data = await response.json();
        setOrders(data); // Store the data in the state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Fetch filtered orders based on selected filters
  useEffect(() => {
    const fetchFilteredOrders = async () => {
      let url = "http://127.0.0.1:3577/orders/egg-bucket-b2b/getAllOrder";
      const filters = [];

      // Add outlet filter if selected
      if (outletFilter !== "Outlet") {
        const selectedOutlet = outlets.find(
          (outlet) => `Outlet ${outlet.outletNumber}` === outletFilter
        );
        if (selectedOutlet) {
          filters.push(`outletId=${selectedOutlet._id}`);
        }
      }

      // Add customer filter if selected
      if (customerFilter !== "Customer") {
        const selectedCustomer = customers.find(
          (customer) => `Customer ${customer.customerId}` === customerFilter
        );
        if (selectedCustomer) {
          filters.push(`customerId=${selectedCustomer._id}`);
        }
      }

      // Add status filter if selected
      if (statusFilter !== "Status") {
        filters.push(`status=${statusFilter.toLowerCase()}`);
      }

      // Append filters to URL if any
      if (filters.length) {
        url += `?${filters.join("&")}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setOrders(data); // Store the filtered data in the state
      } catch (error) {
        console.error("Error fetching filtered orders:", error);
      }
    };

    fetchFilteredOrders();
  }, [outletFilter, customerFilter, statusFilter, outlets, customers]);

  return (
    <div className="h-full flex flex-col bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Details</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 flex-grow flex flex-col">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">
            <Filter className="w-4 h-4 mr-2" />
            Filter By
          </button>
          {/* <FilterDropdown
            value={dateFilter}
            onChange={setDateFilter}
            options={["Date", "This Week", "This Month", "This Year"]}
          /> */}
          <FilterDropdown
            value={outletFilter}
            onChange={setOutletFilter}
            options={[
              "Outlet",
              ...outlets.map((outlet) => `Outlet ${outlet.outletNumber}`),
            ]}
          />
          <FilterDropdown
            value={customerFilter}
            onChange={setCustomerFilter}
            options={[
              "Customer",
              ...customers.map((customer) => `Customer ${customer.customerId}`),
            ]}
          />
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              "Status",
              "Intransit",
              "Pending",
              "Cancelled",
              "Completed",
            ]}
          />
          <button
            className="flex items-center px-4 py-2 text-blue-600 font-medium text-sm"
            onClick={() => {
              setDateFilter("Date");
              setOutletFilter("Outlet");
              setCustomerFilter("Customer");
              setStatusFilter("Status"); // Add this line to reset the status filter
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Filter
          </button>
        </div>

        <div className="flex-grow overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 text-sm font-semibold text-gray-600">
                  OUTLET ID
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">
                  CUSTOMER ID
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">
                  NUMBER OF TRAYS
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">
                  DELIVERY PARTNER
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">
                  AMOUNT COLLECTED
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200">
                  <td className="p-3 text-sm">
                    {order.outletId ? order.outletId.outletNumber : "N/A"}
                  </td>
                  <td className="p-3 text-sm">
                    {order.customerId ? order.customerId.customerName : "N/A"}
                  </td>
                  <td className="p-3 text-sm">{order.numTrays}</td>
                  <td className="p-3 text-sm">
                    {order.deliveryId ? order.deliveryId.firstName : "N/A"}
                  </td>
                  <td className="p-3 text-sm">${order.amount}</td>
                  <td className="p-3">{order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      className="appearance-none bg-gray-100 border border-gray-200 rounded-full py-2 pl-4 pr-8 text-sm font-medium"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

export default OrderDetails;
