import { useState, useEffect } from 'react';
import { Edit, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdMobAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/admob-ads');
      if (response.ok) {
        const data = await response.json();
        setAds(data);
        // Initialize form data with first ad if exists
        if (data.length > 0) {
          setFormData(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (adId) => {
    try {
      const response = await fetch('/api/admob-ads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id: adId }),
      });

      if (response.ok) {
        await fetchAds();
        alert('Ad configuration updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating ad:', error);
      alert('Error updating ad');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
            <h1 className="text-3xl font-bold text-gray-900">AdMob Ads Management</h1>
            <p className="text-gray-600 mt-2">Manage your AdMob advertisement configurations</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ad Configs</p>
              <p className="text-2xl font-bold text-gray-900">{ads.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <ToggleRight className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enabled Ads</p>
              <p className="text-2xl font-bold text-gray-900">
                {ads.filter(ad => ad.is_ads_enabled).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <ToggleLeft className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disabled Ads</p>
              <p className="text-2xl font-bold text-gray-900">
                {ads.filter(ad => !ad.is_ads_enabled).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Edit Form for each Ad Config */}
      {ads.map((ad) => (
        <div key={ad._id} className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Ad Configuration #{ad._id.slice(-6)}
            </h3>
            <button
              onClick={() => handleSave(ad._id)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interstitial Ad ID
              </label>
              <input
                type="text"
                value={formData.interstitial_ad_id || ad.interstitial_ad_id || ''}
                onChange={(e) => handleInputChange('interstitial_ad_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Ad ID
              </label>
              <input
                type="text"
                value={formData.banner_ad_id || ad.banner_ad_id || ''}
                onChange={(e) => handleInputChange('banner_ad_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Native Ad ID
              </label>
              <input
                type="text"
                value={formData.native_ad_id || ad.native_ad_id || ''}
                onChange={(e) => handleInputChange('native_ad_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Open Ad ID
              </label>
              <input
                type="text"
                value={formData.app_open_ad_id || ad.app_open_ad_id || ''}
                onChange={(e) => handleInputChange('app_open_ad_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward Ad ID
              </label>
              <input
                type="text"
                value={formData.reward_ad_id || ad.reward_ad_id || ''}
                onChange={(e) => handleInputChange('reward_ad_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`is_ads_enabled_${ad._id}`}
                checked={formData.is_ads_enabled !== undefined ? formData.is_ads_enabled : ad.is_ads_enabled || false}
                onChange={(e) => handleInputChange('is_ads_enabled', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor={`is_ads_enabled_${ad._id}`} className="ml-2 block text-sm text-gray-900">
                Enable Ads
              </label>
            </div>
          </div>
        </div>
      ))}

      {ads.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ad configurations found</h3>
          <p className="text-gray-600 mb-4">No AdMob configurations available in database.</p>
        </div>
      )}
    </div>
  );
}