import React, { useState, useEffect } from 'react';
import { Sprout, Trash2, Eye, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading/Loading';

export const ManageListings = ({ onListingUpdated }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/listings');
      setListings(res.data.listings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (listingId) => {
    if (!window.confirm("Are you sure you want to remove this waste listing as admin?")) return;
    try {
      await api.delete(`/waste/listings/${listingId}`);
      setListings(prev => prev.filter(l => l.id !== listingId));
      if (onListingUpdated) onListingUpdated();
    } catch (err) {
      alert("Failed to delete listing.");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAF3E8] shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#EAF3E8]">
        <div>
          <h3 className="font-heading font-black text-lg text-[#26372C] flex items-center gap-2">
            <Sprout size={20} className="text-[#2F7D4A]" /> Waste Listings Moderation
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 font-sans">
            Monitor and moderate all agricultural residues listed on Kisan Connect
          </p>
        </div>
        <span className="text-xs font-heading font-bold text-gray-500">
          Total {listings.length} Lots
        </span>
      </div>

      {loading ? (
        <Loading message="Loading marketplace listings..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left admin-table font-sans">
            <thead>
              <tr>
                <th>Item / Title</th>
                <th>Category</th>
                <th>Farmer</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFBF9]">
                  <td className="font-heading font-bold text-[#26372C]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=100&q=80"}
                        alt={item.title}
                        className="w-9 h-9 rounded-xl object-cover border border-[#EAF3E8]"
                      />
                      <div>
                        <span>{item.title}</span>
                        <span className="block text-[11px] text-gray-400 font-sans font-normal">{item.village_district || 'Local'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-gray-600 font-sans">{item.category_name}</td>
                  <td className="text-xs font-semibold text-[#26372C] font-sans">{item.farmer_name}</td>
                  <td className="text-xs font-heading font-bold text-[#26372C]">{item.quantity} {item.unit}</td>
                  <td className="text-xs font-heading font-bold text-[#2F7D4A]">
                    {item.expected_price ? `₹${item.expected_price}/${item.unit}` : 'Negotiable'}
                  </td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-[#EAF3E8] text-[#2F7D4A] uppercase tracking-wider">
                      {item.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/waste-details/${item.id}`}
                        className="p-1.5 text-gray-500 hover:text-[#2F7D4A] rounded-lg hover:bg-[#EAF3E8]"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                        title="Delete Listing"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageListings;
