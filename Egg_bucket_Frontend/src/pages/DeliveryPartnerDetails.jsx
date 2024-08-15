import React, { useState, useEffect } from 'react';
import { Filter, Search, RotateCcw, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditDeliveryPartner from '../components/forms/EditDeliveryPartner';

const DeliveryPartnerDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);

  const fetchDeliveryPartners = async (query) => {
    try {
      const response = await fetch('http://127.0.0.1:3577/deliveryDrivers/egg-bucket-b2b/displayAll-delivery_partner'+query);
      const data = await response.json();
      if (Array.isArray(data)) {
        setDeliveryPartners(data);
      } else {
        console.error('Error fetching delivery partners:', data);
      }
    } catch (error) {
      console.error('Error fetching delivery partners:', error);
    }
  };

  useEffect(() => {

    fetchDeliveryPartners('?firstName=');
  }, []);

  const handleEditClick = (partner) => {
    setEditingPartner(partner);
  };

  const handleCloseEdit = () => {
    setEditingPartner(null);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const response = await fetch(`http://127.0.0.1:3577/deliveryDrivers/egg-bucket-b2b/delivery_partner/${editingPartner._id}`, {
        method: 'PATCH',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        // Update the partner in the local state
        setDeliveryPartners(partners => partners.map(p => p._id === editingPartner._id ? data : p));
        setEditingPartner(null);
        alert('Delivery partner updated successfully');
      } else {
        alert('Failed to update delivery partner');
      }
      window.location.reload()
    } catch (error) {
      console.error('Error updating delivery partner:', error);
      alert('Error updating delivery partner');
    }

  };


  const handleDeleteClick = async (partnerId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this delevery partner?');
    if (confirmDelete) {

       console.log(partnerId)
      try {
        const response = await fetch(`http://127.0.0.1:3577/deliveryDrivers/egg-bucket-b2b/delivery_partner/${partnerId}`, {
          method: 'DELETE'
        });
         
        if (response.ok) {

          alert('Delevery partner deleted successfully');  
          window.location.reload();
          
        } else {
          alert('Failed to delete Delevery partner');
        }
     
      } catch (error) {
        console.error('Error deleting delevery partner :', error);
        alert('Error deleting delevery partner');
       
        
      }
    }
  };
 

  return (
    <div className="h-full pt-7 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Delivery Partner Details</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 flex-grow flex flex-col">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter By
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); fetchDeliveryPartners('?firstName='+e.target.value)}}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-blue-600">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset Filter
            </button>
            <button onClick={() => navigate('/delivery-partners/new')} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">
              ADD NEW DELIVERY PARTNER
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
                {/* <th className="text-left p-2 text-sm font-semibold text-gray-600">ID</th> */}
                <th className="text-left p-2 text-sm font-semibold text-gray-600">NAME</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">PHONE NO</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">DRIVER LICENSE</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">PHOTO</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {deliveryPartners.map(partner => (
                <tr key={partner._id}>
                  {/* <td className="text-left p-2 text-sm text-gray-600">{partner._id}</td> */}
                  <td className="text-left p-2 text-sm text-gray-600">{`${partner.firstName} ${partner.lastName}`}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{partner.phoneNumber}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{partner.driverLicenceNumber || 'N/A'}</td>
                  <td className="text-left p-2 text-sm text-gray-600">
                    <img src={partner.img} alt={partner.firstName} className="w-12 h-12 object-cover rounded-md" />
                  </td>
                  <td className="text-left p-2 text-sm text-gray-600">
                    <button className='text-purple-600' onClick={() => handleEditClick(partner)}>
                      <Edit className='w-5 h-5'/>
                    </button>&nbsp;
                    <button className='text-red-600' onClick={()=>handleDeleteClick(partner._id)}>
                      <Trash className='w-5 h-5'/>
                    </button>
                    {/* <button className='text-purple-600'>
                      <Edit className='w-5 h-5'/>
                    </button>&nbsp;
                    <button className='text-red-600'>
                      <Trash className='w-5 h-5'/>
                    </button>  */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingPartner && (
        <EditDeliveryPartner 
          partner={editingPartner}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default DeliveryPartnerDetails;
