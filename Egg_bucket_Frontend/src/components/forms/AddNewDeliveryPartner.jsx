import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddNewDeliveryPartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    driverLicense: '',
    uniquePassword: '',
    phoneNumber: '',
    img: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    const generatePassword = () => {
      const timestamp = Date.now();
      return `DP_${timestamp}`;
    };
    setFormData(prevState => ({
      ...prevState,
      uniquePassword: generatePassword()
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prevState => ({
        ...prevState,
        [name]: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    const formDataToSubmit = new FormData();  
    formDataToSubmit.append('firstName', formData.firstName);
    formDataToSubmit.append('lastName', formData.lastName);
    formDataToSubmit.append('driverLicenceNumber', formData.driverLicense);
    formDataToSubmit.append('password', formData.uniquePassword);
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);
    formDataToSubmit.append('img', formData.img);

    try {
      const response = await fetch('http://127.0.0.1:3577/deliveryDrivers/egg-bucket-b2b/create-delivery_partner', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      const result = await response.json();
      console.log('Success:', result);
      alert("Successfully added delivery partner.");
      window.location.reload()
      // Redirect to the Delivery Partner Details page after successful submission
      navigate('/delivery-partner');
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to add delivery partner.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Delivery Partner</h1>
      
      <div className="mb-6 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <label className="cursor-pointer text-blue-500 text-sm font-medium">
          Upload Photo
          <input
            type="file"
            name="img"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver License</label>
            <input
              type="text"
              name="driverLicense"
              value={formData.driverLicense}
              onChange={handleChange}
              placeholder="Enter driver license number"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unique Password</label>
            <input
              type="text"
              name="uniquePassword"
              value={formData.uniquePassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full p-2 border border-gray-300 rounded-md"
             pattern="\d{10}"
             title="Please enter exactly 10 digits"
            required
          />
        </div>
        
        <div className="text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Delivery Partner
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewDeliveryPartner;
