import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Play, 
  Tv,
  ArrowLeft,
  Calendar,
  Eye
} from 'lucide-react';

export default function Episodes() {
  const [serials, setSerials] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSerial, setSelectedSerial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail: '',
    duration: '',
    episode_number: '',
    release_date: ''
  });

  // Fetch serials
  const fetchSerials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-all-data');
      const result = await response.json();
      
      if (result.success) {
        setSerials(result.data.serials || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch serials');
    } finally {
      setLoading(false);
    }
  };

  // Fetch episodes for selected serial
  const fetchEpisodes = async (serialId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/episodes?serial_id=${serialId}`);
      const result = await response.json();
      
      if (result.success) {
        setEpisodes(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch episodes');
    } finally {
      setLoading(false);
    }
  };

  // Handle serial selection
  const handleSerialSelect = (serial) => {
    setSelectedSerial(serial);
    fetchEpisodes(serial._id);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const episodeData = {
        ...formData,
        serial_id: selectedSerial._id,
        serial_title: selectedSerial.title
      };

      const url = editingEpisode ? `/api/episodes?id=${editingEpisode._id}` : '/api/episodes';
      const method = editingEpisode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(episodeData),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsFormOpen(false);
        setEditingEpisode(null);
        setFormData({
          title: '',
          description: '',
          video_url: '',
          thumbnail: '',
          duration: '',
          episode_number: '',
          release_date: ''
        });
        fetchEpisodes(selectedSerial._id);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to save episode');
    }
  };

  // Handle delete
  const handleDelete = async (episodeId) => {
    if (!confirm('Are you sure you want to delete this episode?')) return;
    
    try {
      const response = await fetch(`/api/episodes?id=${episodeId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        fetchEpisodes(selectedSerial._id);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to delete episode');
    }
  };

  // Handle edit
  const handleEdit = (episode) => {
    setEditingEpisode(episode);
    setFormData({
      title: episode.title || '',
      description: episode.description || '',
      video_url: episode.video_url || '',
      thumbnail: episode.thumbnail || '',
      duration: episode.duration || '',
      episode_number: episode.episode_number || '',
      release_date: episode.release_date ? episode.release_date.split('T')[0] : ''
    });
    setIsFormOpen(true);
  };

  useEffect(() => {
    fetchSerials();
  }, []);

  // Filter serials based on search
  const filteredSerials = serials.filter(serial =>
    serial.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter episodes based on search
  const filteredEpisodes = episodes.filter(episode =>
    episode.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !selectedSerial) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-lg">Loading serials...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">Error: {error}</div>
          <button 
            onClick={() => selectedSerial ? fetchEpisodes(selectedSerial._id) : fetchSerials()}
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Serial List View
  if (!selectedSerial) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Episodes Management</h1>
            <p className="text-gray-600">Select a serial to manage its episodes</p>
          </div>
          <button 
            onClick={fetchSerials}
            className="btn-primary flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search serials..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Serials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSerials.map((serial) => (
            <div key={serial._id} className="card hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => handleSerialSelect(serial)}>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {serial.image ? (
                    <img 
                      src={serial.image} 
                      alt={serial.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Tv className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {serial.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    <Eye className="inline h-4 w-4 mr-1" />
                    {serial.views || 0} views
                  </p>
                  <p className="text-sm text-gray-500">
                    Channel ID: {serial.channel_id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSerials.length === 0 && (
          <div className="text-center py-12">
            <Tv className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No serials found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No serials available.'}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Episodes List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSelectedSerial(null)}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Serials
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Episodes - {selectedSerial.title}
            </h1>
            <p className="text-gray-600">Manage episodes for this serial</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchEpisodes(selectedSerial._id)}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Episode
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search episodes..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Episodes List */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
            <span className="ml-2">Loading episodes...</span>
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="text-center py-12">
            <Play className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No episodes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new episode.'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="btn-primary mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Episode
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Episode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEpisodes.map((episode) => (
                  <tr key={episode._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {episode.thumbnail ? (
                          <img 
                            src={episode.thumbnail} 
                            alt={episode.title}
                            className="h-10 w-10 rounded object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                            <Play className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          #{episode.episode_number || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{episode.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {episode.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {episode.duration || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {episode.release_date ? new Date(episode.release_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {episode.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(episode)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(episode._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Episode Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEpisode ? 'Edit Episode' : 'Add New Episode'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Episode Number
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={formData.episode_number}
                      onChange={(e) => setFormData({...formData, episode_number: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 45:30"
                      className="input"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={formData.video_url}
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.release_date}
                    onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingEpisode(null);
                      setFormData({
                        title: '',
                        description: '',
                        video_url: '',
                        thumbnail: '',
                        duration: '',
                        episode_number: '',
                        release_date: ''
                      });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingEpisode ? 'Update Episode' : 'Add Episode'}
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