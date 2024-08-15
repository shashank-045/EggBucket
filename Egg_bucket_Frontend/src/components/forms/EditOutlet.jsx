import React, { useState, useEffect } from 'react';

const EditOutlet = ({ outlet, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    outletNumber: '',
    outletArea: '',
    phoneNumber: '',
    outletPartner: '',
    deliveryPartners: [],
  });
  const [selectedOutletPartner, setSelectedOutletPartner] = useState(outlet.outletPartner || '');
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [outletPartners, setOutletPartners] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      outletNumber: outlet.outletNumber,
      outletArea: outlet.outletArea,
      phoneNumber: outlet.phoneNumber,
      outletPartner: outlet.outletPartner,
      deliveryPartners: outlet.deliveryPartners,
    });
  }, [outlet]);

  useEffect(() => {
    const fetchOutletPartners = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3577/outletPartners/egg-bucket-b2b/displayAll-outlet_partner');
        const result = await response.json();

        if (result.status === 'success') {
          // Filter free outlet partners
          const freePartners = result.data.filter(partner => partner.outletId === 'free');
          setOutletPartners(freePartners);
        } else {
          console.error('Failed to fetch outlet partners');
        }
      } catch (error) {
        console.error('Error fetching outlet partners:', error);
      }
    };
    
    const fetchDeliveryPartners = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3577/deliveryDrivers/egg-bucket-b2b/displayAll-delivery_partner');
        const data = await response.json();
        if (Array.isArray(data)) {
          setDeliveryPartners(data);
        }
      } catch (error) {
        console.error('Error fetching delivery partners:', error);
      }
    };

    fetchOutletPartners();
    fetchDeliveryPartners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
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

  const handleDeliveryPartnerChange = (index, value) => {
    const updatedPartners = formData.deliveryPartners.map((partner, i) => 
      i === index ? value : partner
    );
    setFormData(prevState => ({
      ...prevState,
      deliveryPartners: updatedPartners
    }));
  };

  const handleAddDeliveryPartner = () => {
    setFormData(prevState => ({
      ...prevState,
      deliveryPartners: [...prevState.deliveryPartners, '']
    }));
  };

  const handleRemoveDeliveryPartner = (index) => {
    const updatedPartners = formData.deliveryPartners.filter((_, i) => i !== index);
    setFormData(prevState => ({
      ...prevState,
      deliveryPartners: updatedPartners
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});

    // Validate form data
    const newErrors = {};
    if (!formData.outletNumber) newErrors.outletNumber = "Outlet Number is required.";
    if (!formData.outletArea) newErrors.outletArea = "Outlet Area is required.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSubmit = new FormData();  
    formDataToSubmit.append('outletNumber', formData.outletNumber);
    formDataToSubmit.append('outletArea', formData.outletArea);
    if(selectedOutletPartner.length==24){
      formDataToSubmit.append('outletPartner', selectedOutletPartner);
    }
  
     formDataToSubmit.append('phoneNumber', formData.phoneNumber);
    
     formData.deliveryPartners.forEach((id) => {
      if(id.length==24)
       formDataToSubmit.append('deliveryPartner[]', id);
     });

    // Handle form submission
    //console.log([...formDataToSubmit]);
     onSave(formDataToSubmit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Outlet</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outlet Number</label>
              <input
                type="text"
                name="outletNumber"
                value={formData.outletNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              {errors.outletNumber && (
                <p className="text-red-500 text-sm">{errors.outletNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outlet Area</label>
              <input
                type="text"
                name="outletArea"
                value={formData.outletArea}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              {errors.outletArea && (
                <p className="text-red-500 text-sm">{errors.outletArea}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
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
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Outlet Partner</label>
            <select
              value={selectedOutletPartner}
              onChange={(e) => setSelectedOutletPartner(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Outlet Partner</option>
              {outletPartners.map((partner) => (
                <option key={partner._id} value={partner._id}>
                  {partner.firstName} {partner.lastName}
                </option>
              ))}
            </select>
          </div>
           
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Partners</label>
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

export default EditOutlet;
