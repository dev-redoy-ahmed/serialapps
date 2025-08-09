import { useState, useEffect } from 'react';
import { Tv, FolderOpen, ShoppingCart, Settings, Megaphone, RefreshCw, Play, Bell, Film, Download } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-all-data');
      const result = await response.json();
      
      if (result.success) {
        setData(result);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">Error: {error}</div>
          <button 
            onClick={fetchData}
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const timestamp = data?.timestamp;

  const statCards = [
    {
      name: 'Total Channels',
      value: stats.channels || 0,
      icon: Tv,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Episodes',
      value: stats.episodes || 0,
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Serials',
      value: stats.serials || 0,
      icon: Film,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Premium Purchases',
      value: stats.premiumPurchases || 0,
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Notices',
      value: stats.notices || 0,
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'AdMob Ads',
      value: stats.admobAds || 0,
      icon: Megaphone,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'App Updates',
      value: stats.appUpdates || 0,
      icon: Download,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },


  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your Bangla Serial app data</p>
        </div>
        <button 
          onClick={fetchData}
          className="btn-primary flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Documents */}
      <div className="card">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Total Documents</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalDocuments || 0}</p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {timestamp ? new Date(timestamp).toLocaleString() : 'Unknown'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/channels" className="btn-primary text-center">
            Manage Channels
          </a>
          <a href="/serials" className="btn-primary text-center">
            Manage Serials
          </a>
          <a href="/episodes" className="btn-primary text-center">
            Manage Episodes
          </a>
          <a href="/notices" className="btn-primary text-center">
            Manage Notices
          </a>
          <a href="/admob-ads" className="btn-primary text-center">
            AdMob Settings
          </a>
        </div>
      </div>

      {/* API Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Information</h3>
        <div className="bg-gray-50 rounded-md p-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Get All Data API:</strong>
          </p>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            GET /api/get-all-data
          </code>
          <p className="text-xs text-gray-500 mt-2">
            This API returns all data from all collections in a single request.
          </p>
        </div>
      </div>
    </div>
  );
}