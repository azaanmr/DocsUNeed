import React, { useState } from 'react';
import { Service } from '../types';
import { 
  FileText, Fingerprint, Vote, Briefcase, Globe, Plus, Trash2, Lock, Unlock, Pencil,
  Landmark, GraduationCap, Plane, Building2, CreditCard, Home, User, LayoutDashboard
} from 'lucide-react';
import { Modal } from './Modal';

interface SidebarProps {
  services: Service[];
  selectedServiceId: string;
  onSelectService: (id: string) => void;
  isEditMode: boolean;
  onAddService: (name: string, iconName: string) => void;
  onEditService: (id: string, data: { name: string; iconName: string }) => void;
  onDeleteService: (id: string) => void;
  onToggleEditMode: () => void;
}

const ServiceIconMap: Record<string, React.ElementType> = {
  Vote, Fingerprint, Briefcase, Globe, FileText, 
  Landmark, GraduationCap, Plane, Building2, CreditCard, Home, User
};

const AVAILABLE_ICONS = Object.keys(ServiceIconMap);

export const Sidebar: React.FC<SidebarProps> = ({
  services,
  selectedServiceId,
  onSelectService,
  isEditMode,
  onAddService,
  onEditService,
  onDeleteService,
  onToggleEditMode
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', iconName: 'FileText' });

  const handleOpenAdd = () => {
    setEditingServiceId(null);
    setFormData({ name: '', iconName: 'FileText' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingServiceId(service.id);
    setFormData({ name: service.name, iconName: service.iconName || 'FileText' });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (formData.name.trim()) {
      if (editingServiceId) {
        onEditService(editingServiceId, formData);
      } else {
        onAddService(formData.name.trim(), formData.iconName);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col h-full md:min-h-screen">
        <div className="p-6 border-b border-slate-700 cursor-pointer" onClick={() => onSelectService('')}>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center flex-shrink-0">
               <img 
                 src="https://cdn-icons-png.flaticon.com/512/1632/1632670.png" 
                 alt="Logo" 
                 className="w-6 h-6 object-contain"
               />
             </div>
             <div>
               <h1 className="text-lg font-bold leading-tight">DocsUNeed</h1>
               <p className="text-[10px] text-slate-400">Checklist Builder</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {/* Home Link */}
            <button
              onClick={() => onSelectService('')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-left mb-4 ${
                selectedServiceId === ''
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} className="flex-shrink-0" />
              <span className="truncate">Dashboard / Home</span>
            </button>
            
            <div className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Services
            </div>

            {services.map((service) => {
              const IconComponent = ServiceIconMap[service.iconName] || FileText;
              return (
                <div key={service.id} className="group flex items-center gap-2">
                  <button
                    onClick={() => onSelectService(service.id)}
                    className={`flex-1 flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                      selectedServiceId === service.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComponent size={18} className="flex-shrink-0" />
                    <span className="truncate">{service.name}</span>
                  </button>
                  
                  {isEditMode && (
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleOpenEdit(service, e)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                        title="Edit Service"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                            if(window.confirm(`Delete ${service.name} and all its contents?`)) onDeleteService(service.id)
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {isEditMode && (
            <div className="mt-4 px-3">
              <button
                onClick={handleOpenAdd}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-600 text-slate-400 p-3 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors text-sm"
              >
                <Plus size={16} /> Add New Service
              </button>
            </div>
          )}
        </div>

        {/* Admin Toggle Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onToggleEditMode}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isEditMode 
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            {isEditMode ? <Unlock size={14} /> : <Lock size={14} />}
            {isEditMode ? 'Exit Admin Mode' : 'Admin Access'}
          </button>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingServiceId ? "Edit Service" : "Add New Service"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              placeholder="e.g., Passport Services"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              autoFocus
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
             <div className="grid grid-cols-6 gap-2">
               {AVAILABLE_ICONS.map((iconKey) => {
                 const Icon = ServiceIconMap[iconKey];
                 const isSelected = formData.iconName === iconKey;
                 return (
                   <button
                     key={iconKey}
                     onClick={() => setFormData({...formData, iconName: iconKey})}
                     className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                       isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                     }`}
                     title={iconKey}
                   >
                     <Icon size={20} />
                   </button>
                 );
               })}
             </div>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium"
          >
            {editingServiceId ? "Save Changes" : "Create Service"}
          </button>
        </div>
      </Modal>
    </>
  );
};
