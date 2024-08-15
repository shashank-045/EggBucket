import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const buttons = [
    { name: 'Add New Customer', route: '/contact/newcustomer' },
    { name: 'Add New Delivery Partner', route: '/contact/newdeliverypartner' },
    { name: 'Add New Outlet', route: '/contact/newoutlet' },
    { name: 'Add New Outlet Partner', route: '/contact/newoutletpartner' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Contact Management</h1>
      <div className="grid grid-cols-1 gap-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => navigate(button.route)}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {button.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Contact;
