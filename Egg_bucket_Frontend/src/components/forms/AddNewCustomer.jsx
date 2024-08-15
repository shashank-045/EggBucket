import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const AddNewCustomer = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    businessName: '',
    locationUrl: '',
    phoneNumber: '',
    outlet: '',
    img: null,
  });

  const [outlets, setOutlets] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    // Fetch all outlets
    fetch('http://127.0.0.1:3577/egg-bucket-b2b/get-all-outlets')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && data.data.length > 0) {
          const latestOutletNumber = Math.max(...data.data.map(outlet => parseInt(outlet.outletNumber)));
          setFormData(prevState => ({
            ...prevState,
            outlet: latestOutletNumber + 1
          }));
        }
      })
      .catch(error => console.error('Error fetching outlets:', error));

    // Fetch all customers
    fetch('http://127.0.0.1:3577/customers/egg-bucket-b2b/getAllCustomer')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const latestCustomerId = Math.max(...data.map(customer => parseInt(customer.customerId)));
          setCustomerId(latestCustomerId + 1);
          setFormData(prevState => ({
            ...prevState,
            customerId: latestCustomerId + 1
          }));
        }
      })
      .catch(error => console.error('Error fetching customers:', error));

    // Fetch all outlets for dropdown
    fetch('http://127.0.0.1:3577/egg-bucket-b2b/get-all-outlets')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setOutlets(data.data);
        }
      })
      .catch(error => console.error('Error fetching outlets:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        img: file
      }));
      setImgPreview(URL.createObjectURL(file)); // Set image preview
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['customerName', 'businessName', 'locationUrl', 'phoneNumber', 'outlet'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }

    // Prepare form data for submission
    const formDataToSend = new FormData();
    formDataToSend.append('customerId', formData.customerId);
    formDataToSend.append('customerName', formData.customerName);
    formDataToSend.append('businessName', formData.businessName);
    formDataToSend.append('location', formData.locationUrl);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('outlet', formData.outlet);
    if (formData.img) {
      formDataToSend.append('img', formData.img);
    }

    // Submit form data
    fetch('http://127.0.0.1:3577/customers/egg-bucket-b2b/create-customer', {
      method: 'POST',
      body: formDataToSend
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          alert('Customer added successfully');
          window.location.reload()
          // Reset form or redirect as needed
        } else {
          alert('Failed to add customer');
        }
      })
      .catch(error => {
        console.error('Error creating customer:', error);
        alert('Error creating customer');
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      
      <div className="mb-6 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
          {imgPreview ? (
            <img src={imgPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <label className="cursor-pointer text-blue-500 text-sm font-medium">
          Upload Customer Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            required
          />
        </label>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              placeholder="Customer ID"
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter Customer Name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter Business Name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location URL/Address</label>
            <input
              type="text"
              name="locationUrl"
              value={formData.locationUrl}
              onChange={handleChange}
              placeholder="Enter URL"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="w-full p-2 border border-gray-300 rounded-md"
              pattern="\d{10}"
              title="Please enter exactly 10 digits"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Outlet</label>
            <select
              name="outlet"
              value={formData.outlet}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>Select Outlet</option>
              {outlets.map(outlet => (
                <option key={outlet._id} value={outlet._id}>
                  {outlet.outletNumber}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add Now
        </button>
      </form>
    </div>
  );
};

export default AddNewCustomer;
