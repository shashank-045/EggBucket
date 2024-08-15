import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const EditDeliveryPartner = ({ partner, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    driverLicense: '',
    phoneNumber: '',
    img: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    // Populate form data with partner details
    setFormData({
      firstName: partner.firstName,
      lastName: partner.lastName,
      driverLicense: partner.driverLicenceNumber || '',
      phoneNumber: partner.phoneNumber,
      img: null,
    });

    // Set image preview if partner has an image
    if (partner.img) {
      setImagePreview(partner.img);
    }
  }, [partner]);

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
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);
    console.log(formData.firstName,formData.lastName,formData.driverLicense,formData.phoneNumber)
    if (formData.img) {
      formDataToSubmit.append('img', formData.img);
    }

    onSave(formDataToSubmit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Delivery Partner</h1>
        
        <div className="mb-6 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <label className="cursor-pointer text-blue-500 text-sm font-medium">
            Update Photo
            <input
              type="file"
              name="img"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
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
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeliveryPartner;