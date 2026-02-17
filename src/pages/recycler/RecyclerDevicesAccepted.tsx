import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recyclerAuthService } from '../../services/recyclerAuth';
import { recyclerAPI } from '../../services/api';
import { 
  LogOut, 
  Package, 
  CheckSquare, 
  Square,
  ChevronDown,
  ChevronUp,
  Save,
  Search,
  Filter,
  Settings,
  ToggleLeft,
  ToggleRight,
  Check
} from 'lucide-react';
import RecyclerSidebar from '../../components/RecyclerSidebar';

interface DevicePricing {
  condition: string;
  storage: string;
  price: number;
}

interface Device {
  id: number;
  brand: string;
  model: string;
  image: string;
  storageOptions: string[];
  conditionOptions: string[];
  selected: boolean;
  pricing: DevicePricing[];
  expanded: boolean;
}

const RecyclerDevicesAccepted: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDevices, setTotalDevices] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [error, setError] = useState('');
  
  // Global storage and condition settings
  const [enabledStorage, setEnabledStorage] = useState<{[key: string]: boolean}>({
    '128GB': true,
    '256GB': true,
    '512GB': true,
    '1TB': true
  });
  
  const [enabledConditions, setEnabledConditions] = useState<{[key: string]: boolean}>({
    'Like New': true,
    'Good': true,
    'Fair': true,
    'Poor': true,
    'Faulty': true
  });

  // Devices data from backend
  const [devices, setDevices] = useState<Device[]>([]);

  // Fetch devices from backend
  useEffect(() => {
    fetchDevices();
  }, [debouncedSearchQuery, brandFilter, currentPage]);

  const fetchDevices = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: any = {
        page: currentPage,
        limit: 10
      };
      
      if (debouncedSearchQuery) params.search = debouncedSearchQuery;
      if (brandFilter !== 'all') params.brand = brandFilter;
      
      const response = await recyclerAPI.devices.getAll(params);
      
      if (response?.data) {
        const devicesData = Array.isArray(response.data) ? response.data : response.data.devices || [];
        
        // Transform backend data to match frontend interface
        const transformedDevices = devicesData.map((device: any) => {
          // Get image from various possible fields in backend
          const deviceImage = device.image || 
                            device.imageUrl || 
                            device.deviceImage || 
                            (device.images && device.images.length > 0 ? device.images[0] : null) ||
                            (device.media && device.media.length > 0 ? device.media[0] : null) ||
                            'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
          
          // Extract storage options as strings
          const storageOptions = (device.storageOptions || []).map((storage: any) => 
            typeof storage === 'object' ? storage?.name || storage?.value || '' : String(storage)
          ).filter((s: string) => s.trim() !== '');
          
          // Extract condition options as strings
          const conditionOptions = (device.conditionOptions || []).map((condition: any) => 
            typeof condition === 'object' ? condition?.name || condition?.value || '' : String(condition)
          ).filter((c: string) => c.trim() !== '');
          
          return {
            id: device._id,
            brand: typeof device.brand === 'object' ? device.brand?.name || '' : device.brand || '',
            model: device.model,
            image: deviceImage,
            storageOptions,
            conditionOptions,
            selected: false,
            pricing: device.pricing || [],
            expanded: false
          };
        });
        
        setDevices(transformedDevices);
        const total = (response as any).pagination?.total || (response as any).total || transformedDevices.length;
        setTotalDevices(total);
        setTotalPages(Math.ceil(total / 10));
      }
    } catch (error: any) {
      console.error('Error fetching devices:', error);
      setError(error.message || 'Failed to load devices');
    } finally {
      setIsLoading(false);
      setLoadingConfig(false);
    }
  };

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build unique storage and condition options from devices
  const allStorageOptions = React.useMemo(() => {
    const storageSet = new Set<string>();
    devices.forEach(device => {
      device.storageOptions.forEach(storage => storageSet.add(storage));
    });
    return Array.from(storageSet).sort();
  }, [devices]);

  const allConditions = React.useMemo(() => {
    const conditionSet = new Set<string>();
    devices.forEach(device => {
      device.conditionOptions.forEach(condition => conditionSet.add(condition));
    });
    return Array.from(conditionSet);
  }, [devices]);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Initialize enabled options dynamically when devices are loaded
  React.useEffect(() => {
    if (devices.length > 0 && allStorageOptions.length > 0 && allConditions.length > 0) {
      // Build initial enabled state from all available options
      const initialStorage: {[key: string]: boolean} = {};
      allStorageOptions.forEach(storage => {
        initialStorage[storage] = enabledStorage[storage] !== undefined ? enabledStorage[storage] : true;
      });
      
      const initialConditions: {[key: string]: boolean} = {};
      allConditions.forEach(condition => {
        initialConditions[condition] = enabledConditions[condition] !== undefined ? enabledConditions[condition] : true;
      });
      
      // Only update if there are new options
      const hasNewStorage = allStorageOptions.some(s => enabledStorage[s] === undefined);
      const hasNewConditions = allConditions.some(c => enabledConditions[c] === undefined);
      
      if (hasNewStorage) {
        setEnabledStorage(initialStorage);
      }
      if (hasNewConditions) {
        setEnabledConditions(initialConditions);
      }
    }
  }, [devices, allStorageOptions, allConditions]);

  // Load existing configuration on mount
  React.useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setLoadingConfig(true);
        const configResponse = await recyclerAuthService.getDeviceConfiguration();
        
        if (configResponse.success && configResponse.data) {
          const { preferences, pricingByDevice } = configResponse.data;
          
          // Update preferences
          if (preferences) {
            if (preferences.enabledStorage) {
              setEnabledStorage(preferences.enabledStorage);
            }
            if (preferences.enabledConditions) {
              setEnabledConditions(preferences.enabledConditions);
            }
            // Store selected devices list
            if (preferences.selectedDevices) {
              (window as any).__savedSelectedDevices = preferences.selectedDevices;
            }
          }
          
          // Store pricing data for later
          if (pricingByDevice) {
            (window as any).__initialPricingData = pricingByDevice;
          }
        }
      } catch (err: any) {
        console.error('Failed to load configuration:', err);
      } finally {
        setLoadingConfig(false);
      }
    };
    
    loadConfiguration();
  }, []);

  // Fetch devices from backend
  React.useEffect(() => {
    const fetchDevices = async () => {
      // Check if user is authenticated before making API call
      const token = localStorage.getItem('recyclerToken');
      const auth = localStorage.getItem('recyclerAuth');
      
      console.log('Auth check:', { 
        hasToken: !!token, 
        authFlag: auth,
        token: token?.substring(0, 20) + '...' 
      });
      
      if (!token || auth !== 'true') {
        console.error('No valid authentication found');
        setError('Authentication required. Please log in.');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError('');
      try {
        console.log('Fetching devices with params:', { searchQuery, brandFilter, page: currentPage });
        const response = await recyclerAuthService.getAllDevices({
          search: searchQuery || undefined,
          brand: brandFilter !== 'all' ? brandFilter : undefined,
          page: currentPage,
          limit: 50, // Fetch 50 devices per page
        });
        
        console.log('Devices fetched successfully:', response.data?.length || 0);
        
        // Get saved pricing data and selected devices
        const savedPricing = (window as any).__initialPricingData || {};
        const savedSelectedDevices = (window as any).__savedSelectedDevices || [];
        
        console.log('Saved selected devices:', savedSelectedDevices);
        console.log('Saved pricing keys:', Object.keys(savedPricing));
        
        // Transform backend data to match frontend interface
        const transformedDevices = response.data.map((device: any) => {
          const deviceId = device._id;
          const deviceIdStr = String(deviceId);
          const devicePricing = savedPricing[deviceId] || [];
          
          // Use device storage options from backend
          const storageOptions = device.storageOptions && device.storageOptions.length > 0
            ? device.storageOptions
            : [];
          
          // Use device condition options from backend
          const conditionOptions = device.conditionOptions && device.conditionOptions.length > 0
            ? device.conditionOptions
            : [];
          
          // Check if device is in saved selected devices list (convert both to strings for comparison)
          const isSelected = savedSelectedDevices.some((id: any) => String(id) === deviceIdStr || String(id._id) === deviceIdStr);
          
          console.log('Device check:', {
            name: device.name,
            deviceId: deviceIdStr,
            isSelected,
            hasPricing: devicePricing.length > 0
          });
          
          return {
            id: deviceId,
            brand: device.brand?.name || device.brand || '',
            model: device.name,
            image: device.image || 'https://via.placeholder.com/100',
            storageOptions,
            conditionOptions,
            selected: isSelected, // Use saved selection state
            expanded: false,
            pricing: devicePricing,
          };
        });
        
        setDevices(transformedDevices);
        
        // Update pagination info
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
          setTotalDevices(response.pagination.total);
        }
      } catch (err: any) {
        console.error('Failed to fetch devices:', err);
        console.error('Error response:', err.response?.data);
        
        // If 401 error, redirect to login
        if (err.response?.status === 401) {
          console.error('Authentication failed, redirecting to login');
          navigate('/recycler/login');
          return;
        }
        
        setError(err.response?.data?.message || err.message || 'Failed to load devices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [debouncedSearchQuery, brandFilter, currentPage, loadingConfig]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await recyclerAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/recycler/login');
    }
  };

  const handleSelectAll = () => {
    setDevices(devices.map(device => ({ ...device, selected: true })));
  };

  const handleDeselectAll = () => {
    setDevices(devices.map(device => ({ ...device, selected: false })));
  };

  const handleToggleDevice = (deviceId: number) => {
    setDevices(devices.map(device => 
      device.id === deviceId ? { ...device, selected: !device.selected } : device
    ));
  };

  const handleExpandDevice = (deviceId: number) => {
    setDevices(devices.map(device => 
      device.id === deviceId ? { ...device, expanded: !device.expanded } : device
    ));
  };

  const handlePriceChange = (deviceId: number, condition: string, storage: string, price: number) => {
    setDevices(devices.map(device => {
      if (device.id === deviceId) {
        const existingPricing = device.pricing.filter(p => 
          !(p.condition === condition && p.storage === storage)
        );
        return {
          ...device,
          pricing: [...existingPricing, { condition, storage, price }]
        };
      }
      return device;
    }));
  };

  const getPriceForConditionAndStorage = (device: Device, condition: string, storage: string): number => {
    const pricing = device.pricing.find(p => p.condition === condition && p.storage === storage);
    return pricing ? pricing.price : 0;
  };

  const handleSaveDevice = async (deviceId: number) => {
    const device = devices.find(d => d.id === deviceId);
    
    if (!device || !device.selected) {
      alert('Please select the device first.');
      return;
    }
    
    setIsSaving(true);
    try {
      // Only send pricing for this specific device
      const devicePricing = [{
        deviceId: String(device.id),
        pricing: device.pricing,
      }];
      
      const configData = {
        selectedDevices: [], // Empty array tells backend to NOT update selections
        devicePricing, // Only update pricing for this one device
        enabledStorage,
        enabledConditions,
      };
      
      console.log('Saving single device:', configData);
      
      const response = await recyclerAuthService.saveDeviceConfiguration(configData);
      
      if (response.success) {
        alert(`✅ Successfully saved ${device.model} configuration!`);
      } else {
        throw new Error(response.message || 'Failed to save configuration');
      }
    } catch (err: any) {
      console.error('Save device error:', err);
      alert(`❌ Failed to save device: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    const selectedDevices = devices.filter(d => d.selected);
    
    if (selectedDevices.length === 0) {
      alert('Please select at least one device to save.');
      return;
    }
    
    setIsSaving(true);
    try {
      // Prepare data for backend (convert IDs to strings)
      const selectedDeviceIds = selectedDevices.map(d => String(d.id));
      const devicePricing = selectedDevices.map(device => ({
        deviceId: String(device.id),
        pricing: device.pricing,
      }));
      
      const configData = {
        selectedDevices: selectedDeviceIds,
        devicePricing,
        enabledStorage,
        enabledConditions,
      };
      
      console.log('Saving configuration:', configData);
      
      const response = await recyclerAuthService.saveDeviceConfiguration(configData);
      
      if (response.success) {
        alert(`✅ Successfully saved ${response.data.savedCount} device configurations!`);
        if (response.data.errorCount > 0) {
          console.warn('Some devices had errors:', response.data.errors);
        }
      } else {
        throw new Error(response.message || 'Failed to save configuration');
      }
    } catch (err: any) {
      console.error('Save configuration error:', err);
      alert(`❌ Failed to save configuration: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Devices are already filtered by backend, no need for client-side filtering
  const filteredDevices = devices;

  const uniqueBrands = Array.from(new Set(devices.map(d => d.brand).filter(b => b && b.trim() !== '')));
  const selectedCount = devices.filter(d => d.selected).length;
  
  const toggleStorage = (storage: string) => {
    setEnabledStorage(prev => ({ ...prev, [storage]: !prev[storage] }));
  };
  
  const toggleCondition = (condition: string) => {
    setEnabledConditions(prev => ({ ...prev, [condition]: !prev[condition] }));
  };
  
  const getEnabledStorageForDevice = (device: Device) => {
    // Return device storage options that are enabled in global settings
    const deviceStorage = device.storageOptions || [];
    return deviceStorage.filter(s => enabledStorage[s] !== false);
  };
  
  const getConditionsForDevice = (device: Device) => {
    // Return device conditions that are enabled in global settings
    const deviceConditions = device.conditionOptions || [];
    return deviceConditions.filter(c => enabledConditions[c] !== false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <RecyclerSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Devices We Accept</h1>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#1b981b] rounded-full animate-pulse"></span>
                      Select devices and configure pricing for different conditions
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats and Actions Bar */}
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1b981b]/5 to-transparent rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Devices</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{devices.length}</p>
                    </div>
                  </div>
                  <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Selected</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-full animate-pulse"></div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-[#1b981b] to-[#157a15] bg-clip-text text-transparent">{selectedCount}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 rounded-xl font-semibold transition-all text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    Global Settings
                  </button>
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#1b981b]/10 to-[#157a15]/10 hover:from-[#1b981b]/20 hover:to-[#157a15]/20 text-[#1b981b] rounded-xl font-semibold transition-all text-sm border border-[#1b981b]/20 hover:border-[#1b981b]/40 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-semibold transition-all text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Square className="w-4 h-4" />
                    Deselect All
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={selectedCount === 0 || isSaving}
                    className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#0d8a0d] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl text-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:scale-105"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Configuration
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Global Settings Panel */}
            {showSettings && (
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-3xl shadow-2xl border-2 border-purple-200 p-8 mb-6 animate-in slide-in-from-top-4 duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#1b981b]/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-gray-900 to-purple-700 bg-clip-text text-transparent">Global Settings</span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 ml-13">Configure settings that apply to all devices</p>
                </div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Storage Options */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-md">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#1b981b] rounded-full"></div>
                      Storage Options
                    </h4>
                    <div className="space-y-3">
                      {allStorageOptions.map(storage => (
                        <button
                          key={storage}
                          onClick={() => toggleStorage(storage)}
                          className={`group w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                            enabledStorage[storage]
                              ? 'bg-gradient-to-r from-[#1b981b]/10 to-[#157a15]/10 border-[#1b981b] text-[#1b981b] shadow-md hover:shadow-lg'
                              : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                          } transform hover:-translate-y-0.5`}
                        >
                          <span className="font-bold text-sm">{storage}</span>
                          {enabledStorage[storage] ? (
                            <ToggleRight className="w-7 h-7 text-[#1b981b] group-hover:scale-110 transition-transform" />
                          ) : (
                            <ToggleLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Condition Options */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-md">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Condition Options
                    </h4>
                    <div className="space-y-3">
                      {allConditions.map(condition => (
                        <button
                          key={condition}
                          onClick={() => toggleCondition(condition)}
                          className={`group w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                            enabledConditions[condition]
                              ? 'bg-gradient-to-r from-[#1b981b]/10 to-[#157a15]/10 border-[#1b981b] text-[#1b981b] shadow-md hover:shadow-lg'
                              : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                          } transform hover:-translate-y-0.5`}
                        >
                          <span className="font-bold text-sm">{condition}</span>
                          {enabledConditions[condition] ? (
                            <ToggleRight className="w-7 h-7 text-[#1b981b] group-hover:scale-110 transition-transform" />
                          ) : (
                            <ToggleLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-sm">ℹ</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800 mb-1">Important Note</p>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        Disabled options will be hidden from the pricing tables for all devices. 
                        Only enabled storage and condition options will be available for price configuration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {(isLoading || loadingConfig) && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    {loadingConfig ? 'Loading configuration...' : 'Loading devices...'}
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">!</span>
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Error Loading Devices</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filter */}
            {!isLoading && !error && (
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold text-[#1b981b]">{devices.length}</span> of <span className="font-bold">{totalDevices}</span> devices
                </p>
                <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-[#1b981b]/10 to-[#157a15]/10 rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-[#1b981b]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by brand or model..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to page 1 on search
                    }}
                    className="w-full pl-16 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-medium shadow-sm hover:shadow-md"
                  />
                </div>
                <div className="relative w-full md:w-56">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                    <Filter className="w-4 h-4 text-blue-600" />
                  </div>
                  <select
                    value={brandFilter}
                    onChange={(e) => {
                      setBrandFilter(e.target.value);
                      setCurrentPage(1); // Reset to page 1 on filter change
                    }}
                    className="w-full pl-16 pr-10 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-semibold appearance-none cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <option value="all">All Brands</option>
                    {uniqueBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            )}

            {/* Device List */}
            {!isLoading && !error && (
              <div>
                {filteredDevices.length > 0 ? (
                  <div className="space-y-5">
                    {filteredDevices.map((device) => (
                <div
                  key={device.id}
                  className={`group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 transition-all duration-300 ${
                    device.selected 
                      ? 'border-[#1b981b] shadow-2xl scale-[1.01]' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                  }`}
                >
                  {device.selected && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1b981b]/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  )}
                  {/* Device Header */}
                  <div className="relative z-10 p-6">
                    <div className="flex items-center gap-5">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleDevice(device.id)}
                        className="flex-shrink-0 transform hover:scale-110 transition-transform"
                      >
                        {device.selected ? (
                          <div className="w-7 h-7 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-lg flex items-center justify-center shadow-lg">
                            <CheckSquare className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <Square className="w-7 h-7 text-gray-400 hover:text-[#1b981b] transition-colors" />
                        )}
                      </button>

                      {/* Device Image */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md p-2">
                          <img 
                            src={device.image} 
                            alt={device.model}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                            }}
                          />
                        </div>
                        {device.selected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#1b981b] rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white font-bold" />
                          </div>
                        )}
                      </div>

                      {/* Device Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{device.model}</h3>
                        <p className="text-sm font-semibold text-gray-500 mb-3">{device.brand}</p>
                        <div className="flex flex-wrap gap-2">
                          {device.storageOptions.map(storage => (
                            <span
                              key={storage}
                              className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg text-xs font-bold shadow-sm"
                            >
                              {storage}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Expand Button */}
                      {device.selected && (
                        <button
                          onClick={() => handleExpandDevice(device.id)}
                          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#1b981b]/10 to-[#157a15]/10 hover:from-[#1b981b]/20 hover:to-[#157a15]/20 text-[#1b981b] rounded-xl font-bold transition-all text-sm border border-[#1b981b]/30 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <span>Configure Pricing</span>
                          {device.expanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pricing Configuration (Expanded) */}
                  {device.selected && device.expanded && (
                    <div className="relative z-10 px-6 pb-6 border-t-2 border-gray-200 pt-6 bg-gradient-to-b from-gray-50/50 to-white animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">£</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">
                            Set Pricing by Condition & Storage
                          </h4>
                          <p className="text-xs text-gray-500">Configure prices for all combinations</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Condition</th>
                              {getEnabledStorageForDevice(device).map(storage => (
                                <th key={storage} className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                                  {storage}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {getConditionsForDevice(device).map(condition => (
                              <tr key={condition} className="border-b border-gray-100">
                                <td className="py-3 px-4">
                                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                    condition === 'Like New' || condition === 'Excellent' ? 'bg-green-100 text-green-700' :
                                    condition === 'Good' ? 'bg-blue-100 text-blue-700' :
                                    condition === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                                    condition === 'Poor' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {condition}
                                  </span>
                                </td>
                                {getEnabledStorageForDevice(device).map(storage => (
                                  <td key={storage} className="py-3 px-4">
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">£</span>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={getPriceForConditionAndStorage(device, condition, storage)}
                                        onChange={(e) => handlePriceChange(device.id, condition, storage, parseFloat(e.target.value) || 0)}
                                        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm"
                                        placeholder="0.00"
                                      />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Individual Save Button */}
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handleSaveDevice(device.id)}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#1b981b] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-5 h-5" />
                          <span>{isSaving ? 'Saving...' : 'Save This Device'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No devices found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && !error && filteredDevices.length > 0 && totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#1b981b] hover:text-[#1b981b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#1b981b] hover:text-[#1b981b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-bold transition-all ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white shadow-lg'
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1b981b] hover:text-[#1b981b]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#1b981b] hover:text-[#1b981b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#1b981b] hover:text-[#1b981b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Last
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecyclerDevicesAccepted;
