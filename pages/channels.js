import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Save, X } from 'lucide-react';

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChannel, setEditingChannel] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    stream_url: '',
    is_active: true,
    is_premium: false,
    sort_order: 0,
    country: 'Bangladesh',
    language: 'Bangla',
    quality: 'HD'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const channelsRes = await fetch('/api/channels');
      
      const channelsData = await channelsRes.json();
      
      if (channelsData.success) setChannels(channelsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingChannel ? 'PUT' : 'POST';
      const body = editingChannel ? { _id: editingChannel._id, ...formData } : formData;
      
      const response = await fetch('/api/channels', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        await fetchData();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving channel:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this channel?')) return;
    
    try {
      const response = await fetch(`/api/channels?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  const handleEdit = (channel) => {
    setEditingChannel(channel);
    setFormData({ ...channel });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingChannel(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      stream_url: '',
      is_active: true,
      is_premium: false,
      sort_order: 0,
      country: 'Bangladesh',
      language: 'Bangla',
      quality: 'HD'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-lg">Loading channels...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Channels Management</h1>
          <p className="text-gray-600">Manage your TV channels</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button 
            onClick={() => setShowAddForm(true)} 
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Channel
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              {editingChannel ? 'Edit Channel' : 'Add New Channel'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            

            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stream URL</label>
              <input
                type="url"
                required
                value={formData.stream_url}
                onChange={(e) => setFormData({...formData, stream_url: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
              <select
                value={formData.quality}
                onChange={(e) => setFormData({...formData, quality: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="HD">HD</option>
                <option value="FHD">FHD</option>
                <option value="4K">4K</option>
                <option value="SD">SD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={(e) => setFormData({...formData, is_premium: e.target.checked})}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Premium</span>
              </label>
            </div>
            
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingChannel ? 'Update' : 'Save'} Channel
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Channels Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Country</th>
                <th className="table-header-cell">Quality</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Premium</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {channels.map((channel) => (
                <tr key={channel._id}>
                  <td className="table-cell">
                    <div className="flex items-center">
                      {channel.logo_url && (
                        <img 
                          src={channel.logo_url} 
                          alt={channel.name}
                          className="h-8 w-8 rounded mr-3"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div>
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-gray-500 text-sm">{channel.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{channel.country}</td>
                  <td className="table-cell">{channel.quality}</td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      channel.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {channel.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      channel.is_premium 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {channel.is_premium ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(channel)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(channel._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}