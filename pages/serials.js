import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, Tv } from 'lucide-react';

export default function Serials() {
  const [serials, setSerials] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSerial, setEditingSerial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    channelId: '',
    imageUrl: '',
    status: 'active'
  });

  useEffect(() => {
    fetchSerials();
    fetchChannels();
  }, []);

  const fetchSerials = async () => {
    try {
      const response = await fetch('/api/serials');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSerials(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching serials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChannels(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = '/api/serials';
      const method = editingSerial ? 'PUT' : 'POST';
      const body = editingSerial 
        ? { ...formData, id: editingSerial._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchSerials();
        setShowModal(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving serial:', error);
      alert('Error saving serial');
    }
  };

  const handleEdit = (serial) => {
    setEditingSerial(serial);
    setFormData({
      name: serial.name,
      description: serial.description || '',
      channelId: serial.channelId,
      imageUrl: serial.imageUrl || '',
      status: serial.status
    });
    setShowModal(true);
  };

  const handleDelete = async (serialId) => {
    if (confirm('Are you sure you want to delete this serial?')) {
      try {
        const response = await fetch('/api/serials', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: serialId }),
        });

        if (response.ok) {
          await fetchSerials();
        } else {
          const error = await response.json();
          alert(error.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting serial:', error);
        alert('Error deleting serial');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      channelId: '',
      imageUrl: '',
      status: 'active'
    });
    setEditingSerial(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Serials Management</h1>
            <p className="text-gray-600 mt-2">Manage your TV serials and shows</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Serial
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <Tv className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Serials</p>
              <p className="text-2xl font-bold text-gray-900">{serials.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Tv className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Serials</p>
              <p className="text-2xl font-bold text-gray-900">
                {serials.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Tv className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive Serials</p>
              <p className="text-2xl font-bold text-gray-900">
                {serials.filter(s => s.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Serials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serials.map((serial) => (
          <div key={serial._id} className="card hover:shadow-lg transition-shadow">
            {/* Serial Image */}
            <div className="mb-4">
              {serial.imageUrl ? (
                <img
                  src={serial.imageUrl}
                  alt={serial.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center ${serial.imageUrl ? 'hidden' : 'flex'}`}
              >
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            </div>

            {/* Serial Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{serial.name}</h3>
              {serial.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{serial.description}</p>
              )}
              
              {/* Channel Info */}
              {serial.channel && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                  {serial.channel.imageUrl ? (
                    <img
                      src={serial.channel.imageUrl}
                      alt={serial.channel.name}
                      className="w-8 h-8 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-8 h-8 bg-gray-200 rounded flex items-center justify-center ${serial.channel.imageUrl ? 'hidden' : 'flex'}`}
                  >
                    <Tv className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{serial.channel.name}</p>
                    <p className="text-xs text-gray-500">Channel</p>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                serial.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {serial.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(serial)}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(serial._id)}
                className="flex-1 btn-danger flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {serials.length === 0 && (
        <div className="text-center py-12">
          <Tv className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No serials found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first serial.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Add New Serial
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingSerial ? 'Edit Serial' : 'Add New Serial'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel *
                  </label>
                  <select
                    value={formData.channelId}
                    onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Channel</option>
                    {channels.map((channel) => (
                      <option key={channel._id} value={channel._id}>
                        {channel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {editingSerial ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}