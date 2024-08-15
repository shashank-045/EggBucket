import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const EditCustomer = ({ customer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    // businessName: '',
    locationUrl: '',
    phoneNumber: '',
    outlet: '',
    img: null,
  });

  const [outlets, setOutlets] = useState([]);
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    // Populate form data with customer details
    setFormData({
      customerId: customer.customerId,
      customerName: customer.customerName,
      // businessName: customer.businessName || '',
      locationUrl: customer.location,
      phoneNumber: customer.phoneNumber,
      outlet: customer.outlet._id,
      img: null,
    });

    // Set image preview if customer has an image
    if (customer.img) {
      setImgPreview(customer.img);
    }

    // Fetch all outlets for dropdown
    fetch('http://127.0.0.1:3577/egg-bucket-b2b/get-all-outlets')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setOutlets(data.data);
        }
      })
      .catch(error => console.error('Error fetching outlets:', error));
  }, [customer]);

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
    const requiredFields = ['customerName', 'locationUrl', 'phoneNumber', 'outlet'];
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
    // formDataToSend.append('businessName', formData.businessName);
    formDataToSend.append('location', formData.locationUrl);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('outlet', formData.outlet);
   
    if (formData.img) {
      formDataToSend.append('img', formData.img);
    }

    // Call the onSave function passed from the parent component
    onSave(formDataToSend);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Customer</h1>
        
        <div className="mb-6 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
            {imgPreview ? (
              <img src={imgPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <label className="cursor-pointer text-blue-500 text-sm font-medium">
            Update Customer Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
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
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location URL/Address</label>
              <input
                type="text"
                name="locationUrl"
                value={formData.locationUrl}
                onChange={handleChange}
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;