import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Checklist } from './components/Checklist';
import { Homepage } from './components/Homepage';
import { Modal } from './components/Modal';
import { Service, ChecklistItem, CheckedState } from './types';
import { INITIAL_SERVICES } from './constants';
import { Lock } from 'lucide-react';

// Simple ID generator helper since we don't have external libs
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // --- State ---
  const [services, setServices] = useState<Service[]>([]);
  // Initialize with empty string to show Homepage by default
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [checkedItems, setCheckedItems] = useState<CheckedState>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Admin Login State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- Persistence Effect ---
  useEffect(() => {
    const savedServices = localStorage.getItem('docsuneed_services');
    if (savedServices) {
      try {
        const parsed = JSON.parse(savedServices);
        setServices(parsed);
        // Do not auto-select first service, default to Home
      } catch (e) {
        console.error("Failed to parse services", e);
        setServices(INITIAL_SERVICES);
      }
    } else {
      setServices(INITIAL_SERVICES);
    }
    setIsLoading(false);
  }, []);

  // Save whenever services change
  useEffect(() => {
    if (!isLoading && services.length > 0) {
      localStorage.setItem('docsuneed_services', JSON.stringify(services));
    }
  }, [services, isLoading]);

  // --- Actions ---

  const handleToggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      setIsLoginModalOpen(true);
      setLoginError('');
      setPasswordInput('');
    }
  };

  const handleLoginSubmit = () => {
    if (passwordInput === "#Azn@docs09") {
      setIsEditMode(true);
      setIsLoginModalOpen(false);
    } else {
      setLoginError("Incorrect password.");
    }
  };

  const handleToggleItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Service CRUD
  const addService = (name: string, iconName: string) => {
    const newService: Service = {
      id: `svc-${generateId()}`,
      name,
      iconName: iconName || 'FileText',
      sections: []
    };
    setServices([...services, newService]);
    setSelectedServiceId(newService.id);
  };

  const editService = (id: string, data: { name: string; iconName: string }) => {
    setServices(services.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    if (selectedServiceId === id) {
      setSelectedServiceId(''); // Go to home if deleted
    }
  };

  // Section CRUD
  const addSection = (serviceId: string, data: { title: string; description: string; iconName?: string; imageUrl?: string }) => {
    setServices(services.map(svc => {
      if (svc.id !== serviceId) return svc;
      return {
        ...svc,
        sections: [...svc.sections, {
          id: `sec-${generateId()}`,
          title: data.title,
          description: data.description,
          iconName: data.iconName,
          imageUrl: data.imageUrl,
          items: []
        }]
      };
    }));
  };

  const editSection = (serviceId: string, sectionId: string, data: { title: string; description: string; iconName?: string; imageUrl?: string }) => {
    setServices(services.map(svc => {
      if (svc.id !== serviceId) return svc;
      return {
        ...svc,
        sections: svc.sections.map(sec => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            title: data.title,
            description: data.description,
            iconName: data.iconName,
            imageUrl: data.imageUrl
          };
        })
      };
    }));
  };

  const deleteSection = (serviceId: string, sectionId: string) => {
    setServices(services.map(svc => {
      if (svc.id !== serviceId) return svc;
      return {
        ...svc,
        sections: svc.sections.filter(sec => sec.id !== sectionId)
      };
    }));
  };

  // Item CRUD
  const addItem = (serviceId: string, sectionId: string, itemData: Omit<ChecklistItem, 'id'>) => {
    setServices(services.map(svc => {
      if (svc.id !== serviceId) return svc;
      return {
        ...svc,
        sections: svc.sections.map(sec => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            items: [...sec.items, { ...itemData, id: `item-${generateId()}` }]
          };
        })
      };
    }));
  };

  const deleteItem = (serviceId: string, sectionId: string, itemId: string) => {
    setServices(services.map(svc => {
      if (svc.id !== serviceId) return svc;
      return {
        ...svc,
        sections: svc.sections.map(sec => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            items: sec.items.filter(i => i.id !== itemId)
          };
        })
      };
    }));
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading DocsUNeed...</div>;

  const activeService = services.find(s => s.id === selectedServiceId);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        services={services}
        selectedServiceId={selectedServiceId}
        onSelectService={setSelectedServiceId}
        isEditMode={isEditMode}
        onAddService={addService}
        onEditService={editService}
        onDeleteService={deleteService}
        onToggleEditMode={handleToggleEditMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col">
        {activeService ? (
          <Checklist 
            service={activeService}
            checkedState={checkedItems}
            onToggleItem={handleToggleItem}
            isEditMode={isEditMode}
            onAddSection={addSection}
            onEditSection={editSection}
            onDeleteSection={deleteSection}
            onAddItem={addItem}
            onDeleteItem={deleteItem}
          />
        ) : (
          <Homepage services={services} onSelectService={setSelectedServiceId} />
        )}
      </main>

      {/* Admin Login Modal */}
      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        title="Admin Access"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                className={`w-full border rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none ${loginError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter admin password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoginSubmit()}
                autoFocus
              />
              <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
            </div>
            {loginError && <p className="text-red-500 text-xs mt-1">{loginError}</p>}
          </div>

          <button 
            onClick={handleLoginSubmit}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium"
          >
            Access Admin Mode
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;