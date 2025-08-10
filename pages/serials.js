import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Save, X, Upload } from 'lucide-react';

export default function Serials() {
  const [serials, setSerials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSerial, setEditingSerial] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    is_active: true
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const serialsRes = await fetch('/api/serials');
      const serialsData = await serialsRes.json();
      if (serialsData.success) setSerials(serialsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', 'serial');

    try {
      setUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({...formData, image: data.filePath});
      } else {
        alert('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingSerial ? 'PUT' : 'POST';
      const body = editingSerial ? { _id: editingSerial._id, ...formData } : formData;
      
      const response = await fetch('/api/serials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        await fetchData();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving serial:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this serial?')) return;
    
    try {
      const response = await fetch(`/api/serials?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting serial:', error);
    }
  };

  const handleEdit = (serial) => {
    setEditingSerial(serial);
    setFormData({
      name: serial.name || '',
      image: serial.image || '',
      is_active: serial.is_active !== undefined ? serial.is_active : true
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingSerial(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      image: '',
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-lg">Loading serials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serials</h1>
          <p className="text-gray-600">Manage serials</p>
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
            Add Serial
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              {editingSerial ? 'Edit Serial' : 'Add Serial'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Image</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`btn-secondary flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview"
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="/assets/images/serial/sample-serial.svg"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex items-center gap-2" disabled={uploading}>
                <Save className="h-4 w-4" />
                {editingSerial ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Serials Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Image</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {serials.map((serial) => (
                <tr key={serial._id}>
                  <td className="table-cell">
                    <div className="font-medium">{serial.name}</div>
                  </td>
                  <td className="table-cell">
                    {serial.image && (
                      <img 
                        src={serial.image} 
                        alt={serial.name}
                        className="h-8 w-8 rounded"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      serial.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {serial.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(serial)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(serial._id)}
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