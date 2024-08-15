import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash, Filter, ChevronDown, Search, RotateCcw } from 'lucide-react';
import EditOutlet from '../components/forms/EditOutlet';

const OutletDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [outlets, setOutlets] = useState([]);
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState('Outlet');

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3577/egg-bucket-b2b/get-all-outlets');
        const result = await response.json();

        if (result.status === 'success') {
          const outletData = result.data.map(outlet => ({
            id: outlet._id,
            outletNumber: outlet.outletNumber,
            outletArea: outlet.outletArea,
            phoneNumber: outlet.phoneNumber,
            outletPartner: `${outlet.outletPartner.firstName} ${outlet.outletPartner.lastName}`,
            deliveryPartners: outlet.deliveryPartner.map(partner => `${partner.firstName} ${partner.lastName}`),
          }));

          setOutlets(outletData);
        } else {
          console.error('Failed to fetch outlets');
        }
      } catch (error) {
        console.error('Error fetching outlets:', error);
      }
    };

    fetchOutlets();
  }, []);

  const filteredOutlets = outlets.filter(outlet =>
    Object.values(outlet).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEditClick = (outlet) => {
    setEditingOutlet(outlet);
  };

  const handleCloseEdit = () => {
    setEditingOutlet(null);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const response = await fetch(`http://127.0.0.1:3577/egg-bucket-b2b/update-outlet/${editingOutlet.id}`, {
        method: 'PATCH',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify(formData)
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setOutlets(outlets => outlets.map(o => o.id === editingOutlet.id ? { ...o, ...formData } : o));
        setEditingOutlet(null);
        alert('Outlet updated successfully');
      } else {
        alert('Failed to update Outlet');
      }
      window.location.reload()
    } catch (error) {
      console.error('Error updating outlet:', error);
      alert('Error updating outlet');
    }
    
  };


  
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this outlet? '+id);
    if (confirmDelete) {

       console.log(id)
      try {
        const response = await fetch(`http://127.0.0.1:3577/egg-bucket-b2b/delete-outlet/${id}`, {
          method: 'DELETE'
        });
         
        if (response.ok) {
          window.location.reload();
          alert('Outlet deleted successfully');

        } else {
          alert('Failed to delete outlet');
        }
     
      } catch (error) {
        console.error('Error deleting outlet :', error);
        alert('Error deleting outlet');
        
      }
    }
  };

  return (
    <div className="h-full pt-7 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Outlet Details</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 flex-grow flex flex-col">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter By
            </button>
           { 
            
            // <div className="relative">
            //   <select 
            //     className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm"
            //     value={selectedOutlet}
            //     onChange={(e) => setSelectedOutlet(e.target.value)}
            //   >
            //     <option>Outlet</option>
            //     {/* Add more outlet options if needed */}
            //   </select>
            //   <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            // </div>

            }               
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-blue-600">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset Filter
            </button>
            <button onClick={() => navigate('/contact/newoutlet')} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">
              REGISTER NEW OUTLET
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
                <th className="text-left p-2 text-sm font-semibold text-gray-600">Outlet Number</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">Outlet Area</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">Phone Number</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">Outlet Partner</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">Delivery Partners</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOutlets.map((outlet) => (
                <tr key={outlet.id}>
                  <td className="text-left p-2 text-sm text-gray-600">{outlet.outletNumber}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{outlet.outletArea}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{outlet.phoneNumber}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{outlet.outletPartner}</td>
                  <td className="text-left p-2 text-sm text-gray-600">
                    {outlet.deliveryPartners.slice(0, 3).map((partner, index) => (
                      <div key={index}>{partner}</div>
                    ))}
                    {outlet.deliveryPartners.length > 3 && <div>{outlet.deliveryPartners.length - 3} more...</div>}
                  </td>
                  <td className="text-left p-2 text-sm text-gray-600">
                    <button className='text-purple-600' onClick={() => handleEditClick(outlet)}>
                      <Edit className='w-5 h-5'/>
                    </button>&nbsp;
                    <button className='text-red-600' onClick={()=>handleDeleteClick(outlet.id)}>
                      <Trash className='w-5 h-5'/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingOutlet && (
        <EditOutlet 
          outlet={editingOutlet}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default OutletDetails;
