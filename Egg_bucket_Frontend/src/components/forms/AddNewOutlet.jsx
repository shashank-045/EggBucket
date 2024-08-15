import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const AddNewOutlet = () => {
  const [formData, setFormData] = useState({
    outletNumber: '',
    outletArea: '',
    outletPartner: '',
    deliveryPartners: [],
    phoneNumber: '',
    img: null,
  });
  const [outletPartners, setOutletPartners] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch all outlets to get the latest outlet number
    fetch('http://127.0.0.1:3577/egg-bucket-b2b/get-all-outlets')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          const latestOutletNumber =
            data.data.slice(-1)[0]?.outletNumber || '128284';
          setFormData((prevState) => ({
            ...prevState,
            outletNumber: (parseInt(latestOutletNumber) + 1).toString(),
          }));
        }
      });

    // Fetch outlet partners
    fetch(
      'http://127.0.0.1:3577/outletPartners/egg-bucket-b2b/displayAll-outlet_partner'
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          let data2=data.data.filter(el=>el.outletId==='free')
         // console.log(data2)
          setOutletPartners(data2);
        }
      });

    // Fetch delivery partners
    fetch(
      'http://127.0.0.1:3577/deliveryDrivers/egg-bucket-b2b/displayAll-delivery_partner'
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDeliveryPartners(data);
        }
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData((prevState) => ({
        ...prevState,
        img: file,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedDeliveryPartners = checked
        ? [...prevState.deliveryPartners, value]
        : prevState.deliveryPartners.filter((id) => id !== value);
      return { ...prevState, deliveryPartners: updatedDeliveryPartners };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.outletArea) newErrors.outletArea = 'Outlet Area is required.';
    if (!formData.outletPartner)
      newErrors.outletPartner = 'Outlet Partner is required.';
    if (formData.deliveryPartners.length === 0)
      newErrors.deliveryPartners = 'At least one Delivery Partner must be selected.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required.';
    if (!formData.img) newErrors.img = 'Image upload is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('outletNumber', formData.outletNumber);
    formDataToSend.append('outletArea', formData.outletArea);
    formDataToSend.append('outletPartner', formData.outletPartner);
    formDataToSend.append('phoneNumber', formData.phoneNumber);

    // Append each selected delivery partner ID
    formData.deliveryPartners.forEach((id) => {
      formDataToSend.append('deliveryPartner[]', id);
    });

    if (formData.img) {
      formDataToSend.append('img', formData.img);
    }

    fetch('http://127.0.0.1:3577/egg-bucket-b2b/create-outlet', {
      method: 'POST',
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        alert('success...');
        window.location.reload()
        // navigate('/'); 
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('failed...');
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Outlet</h1>

      <div className="mb-6 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <label className="cursor-pointer text-blue-500 text-sm font-medium">
          Upload Shop Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {errors.img && <p className="text-red-500 text-sm">{errors.img}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outlet Number (automatic serial number)
            </label>
            <input
              type="text"
              name="outletNumber"
              value={formData.outletNumber}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outlet Area
            </label>
            <input
              type="text"
              name="outletArea"
              value={formData.outletArea}
              onChange={handleChange}
              placeholder="Enter Area Name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.outletArea && (
              <p className="text-red-500 text-sm">{errors.outletArea}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outlet Partners
            </label>
            <select
              name="outletPartner"
              value={formData.outletPartner}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Outlet Partner</option>
              {outletPartners.map((partner) => (
                <option key={partner._id} value={partner._id}>
                  {partner.firstName}
                </option>
              ))}
            </select>
            {errors.outletPartner && (
              <p className="text-red-500 text-sm">{errors.outletPartner}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Partners
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border p-2 rounded-md">
              {deliveryPartners.map((driver) => (
                <div key={driver._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={driver._id}
                    value={driver._id}
                    checked={formData.deliveryPartners.includes(driver._id)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor={driver._id}
                    className="text-sm font-medium text-gray-700"
                  >
                    {driver.firstName}
                  </label>
                </div>
              ))}
            </div>
            {errors.deliveryPartners && (
              <p className="text-red-500 text-sm">{errors.deliveryPartners}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your Phone Number"
             pattern="\d{10}"
             title="Please enter exactly 10 digits"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
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

export default AddNewOutlet;
