import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const generatePassword = () => {
  // Function to generate a random unique password
  return 'FB_' + Math.floor(1000000 + Math.random() * 9000000);
};

const AddNewOutletPartner = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    aadharNumber: '',
    uniquePassword: generatePassword(), // Generate password dynamically
    phoneNumber: '',
  });
  const [photo, setPhoto] = useState(null); // To hold the selected photo
  const [errors, setErrors] = useState({}); // To store validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(file); // Store the file object instead of data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      valid = false;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      valid = false;
    }
    if (!formData.phoneNumber.trim() || !/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'A valid phone number is required';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const form = new FormData();
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('phoneNumber', formData.phoneNumber);
      form.append('password', formData.uniquePassword);
      form.append('aadharNumber', formData.aadharNumber);
      if (photo) form.append('img', photo);

      try {
        const response = await fetch('http://127.0.0.1:3577/outletPartners/egg-bucket-b2b/create-outlet_partner', {
          method: 'POST',
          body: form
        });

        if (response.ok) {
          const result = await response.json();
          alert("Outlet Partner added successfully..")
          window.location.reload()
          // Handle success (e.g., show a success message or navigate)
        } else {
          console.error('Error:', await response.text());
          alert("Failed to add Outlet Partner")
          // Handle error (e.g., show an error message)
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle network error
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Outlet Partner</h1>
      
      <div className="mb-6 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
          {photo ? (
            <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover rounded-full" />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <label className="cursor-pointer text-blue-500 text-sm font-medium">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
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
              className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number (Optional)</label>
            <input
              type="tel"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              placeholder="Enter Aadhar Number"
               pattern="\d{12}"
               title="Please enter exactly 12 digits"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unique Password</label>
            <input
              type="text"
              name="uniquePassword"
              value={formData.uniquePassword}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your Phone Number"
             pattern="\d{10}"
            title="Please enter exactly 10 digits"
            className={`w-full p-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
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

export default AddNewOutletPartner;
