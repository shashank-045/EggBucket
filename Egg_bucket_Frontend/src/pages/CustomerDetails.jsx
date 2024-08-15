import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, Search, RotateCcw, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditCustomer from '../components/forms/EditCustomer';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [outlet, setOutlet] = useState('Outlet');
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [outlets, setOutlets] = useState([]); // Store all outlets to populate the dropdown

  const fetchCustomers = async (query) => {
    try {
      const response = await fetch('http://127.0.0.1:3577/customers/egg-bucket-b2b/getAllCustomer'+query);
      const data = await response.json();
      if (response.ok) {
        setCustomers(data);
      } else {
        console.error('Error fetching customers:', data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    // Fetch all customers initially
    fetchCustomers('?customerName=');

    // Fetch outlets for the dropdown
    const fetchOutlets = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3577/egg-bucket-b2b/get-all-outlets');
        const data = await response.json();
        if (response.ok) {
          setOutlets(data.data); // Set the outlets to state
        } else {
          console.error('Error fetching outlets:', data);
        }
      } catch (error) {
        console.error('Error fetching outlets:', error);
      }
    };

    fetchOutlets();
  }, []);

  const handleOutletChange = (e) => {
    setOutlet(e.target.value);
    setSearchTerm('');
    const outletQuery = e.target.value !== 'Outlet' ? `?outlet=${e.target.value}` : '?customerName='; 
    fetchCustomers(outletQuery);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
  };

  const handleCloseEdit = () => {
    setEditingCustomer(null);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const response = await fetch(`http://127.0.0.1:3577/customers/egg-bucket-b2b/customer/${editingCustomer._id}`, {
        method: 'PATCH',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setCustomers(customers.map(c => c._id === editingCustomer._id ? data : c));
        setEditingCustomer(null);
        alert('Customer updated successfully');
      } else {
        alert('Failed to update customer');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error updating customer');
    }
  };


  
  const handleDeleteClick = async (Id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this customer?');
    if (confirmDelete) {

       console.log(Id)
      try {
        const response = await fetch(`http://127.0.0.1:3577/customers/egg-bucket-b2b/customer/${Id}`, {
          method: 'DELETE'
        });
         
        if (response.ok) {
          
          alert('Customer deleted successfully');
          window.location.reload();
        } else {
          alert('Failed to delete Customer');
        }
     
      } catch (error) {
        console.error('Error deleting Customer:', error);
        alert('Error deleting Customer');
       
        
      }
    }
  };

  return (
    <div className="h-full pt-7 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 flex-grow flex flex-col">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter By
            </button>
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm"
                value={outlet}
                onChange={handleOutletChange}
              >
                <option value="Outlet">Outlet</option>
                {outlets.map((outlet) => (
                  <option key={outlet._id} value={outlet._id}>
                    {outlet.outletNumber}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Name"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setOutlet('Outlet')
                  fetchCustomers(`?customerName=${e.target.value}`);
                }}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-blue-600" onClick={() => fetchCustomers('?customerName=')}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset Filter
            </button>
            <button onClick={() => navigate('/contact/newcustomer')} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">
              REGISTER NEW CUSTOMER
            </button>
            <button className="px-3 py-2 bg-emerald-500 text-white rounded-md text-sm">
              SPREADSHEET
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 text-sm font-semibold text-gray-600">CID</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">OUTLET ID</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">NAME</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">ADDRESS/URL</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">SHOP NAME</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">PHOTO</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">PHONE NO</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td className="text-left p-2 text-sm text-gray-600">{customer.customerId}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{customer.outlet.outletNumber}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{customer.customerName}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{customer.location}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{customer.outlet.outletArea}</td>
                  <td className="text-left p-2 text-sm text-gray-600">
                    <img src={customer.img} alt={customer.customerName} className="w-12 h-12 object-cover rounded-md" />
                  </td>
                  <td className="text-left p-2 text-sm text-gray-600">{customer.phoneNumber}</td>
                  <td className="text-left p-2 text-sm text-gray-600">
                    <button className='text-purple-600' onClick={() => handleEditClick(customer)}>
                      <Edit className='w-5 h-5'/>
                    </button>&nbsp;
                    <button className='text-red-600' onClick={()=>handleDeleteClick(customer._id)}>
                      <Trash className='w-5 h-5'/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingCustomer && (
        <EditCustomer 
          customer={editingCustomer}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default CustomerDetails;
