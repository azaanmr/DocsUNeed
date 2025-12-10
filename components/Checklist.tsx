import React, { useState } from 'react';
import { Service, ChecklistItem, ChecklistSection } from '../types';
import { 
  CheckCircle2, Circle, Trash2, Plus, Building2, 
  User, MapPin, FileText, CreditCard, Landmark, 
  GraduationCap, Briefcase, Plane, Smartphone, Calendar, Home, Image as ImageIcon, Pencil
} from 'lucide-react';
import { Modal } from './Modal';

// Map for dynamically rendering icons based on string names
const SectionIconMap: Record<string, React.ElementType> = {
  User, MapPin, FileText, CreditCard, Landmark, 
  GraduationCap, Briefcase, Plane, Smartphone, Calendar, Home, Building2
};

const AVAILABLE_ICONS = Object.keys(SectionIconMap);

interface ChecklistProps {
  service: Service;
  checkedState: Record<string, boolean>;
  onToggleItem: (itemId: string) => void;
  isEditMode: boolean;
  onAddSection: (serviceId: string, data: { title: string; description: string; iconName?: string; imageUrl?: string }) => void;
  onEditSection: (serviceId: string, sectionId: string, data: { title: string; description: string; iconName?: string; imageUrl?: string }) => void;
  onDeleteSection: (serviceId: string, sectionId: string) => void;
  onAddItem: (serviceId: string, sectionId: string, item: Omit<ChecklistItem, 'id'>) => void;
  onDeleteItem: (serviceId: string, sectionId: string, itemId: string) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({
  service,
  checkedState,
  onToggleItem,
  isEditMode,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddItem,
  onDeleteItem,
}) => {
  // Modal State for adding/editing Section
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [newSectionData, setNewSectionData] = useState({
    title: '',
    description: '',
    iconName: 'FileText',
    imageUrl: ''
  });

  // Modal State for adding Item
  const [activeSectionForAdd, setActiveSectionForAdd] = useState<string | null>(null);
  const [newItemData, setNewItemData] = useState({ name: '', isMandatory: false, isOfflineOnly: false });

  // --- Handlers ---
  const handleSaveSection = () => {
    if (newSectionData.title.trim()) {
      const data = {
        title: newSectionData.title.trim(),
        description: newSectionData.description.trim(),
        iconName: newSectionData.iconName,
        imageUrl: newSectionData.imageUrl.trim()
      };

      if (editingSectionId) {
        onEditSection(service.id, editingSectionId, data);
      } else {
        onAddSection(service.id, data);
      }
      
      handleCloseSectionModal();
    }
  };

  const handleCloseSectionModal = () => {
    setNewSectionData({ title: '', description: '', iconName: 'FileText', imageUrl: '' });
    setEditingSectionId(null);
    setIsSectionModalOpen(false);
  };

  const handleOpenAddSection = () => {
    setEditingSectionId(null);
    setNewSectionData({ title: '', description: '', iconName: 'FileText', imageUrl: '' });
    setIsSectionModalOpen(true);
  };

  const handleOpenEditSection = (section: ChecklistSection) => {
    setEditingSectionId(section.id);
    setNewSectionData({
      title: section.title,
      description: section.description || '',
      iconName: section.iconName || 'FileText',
      imageUrl: section.imageUrl || ''
    });
    setIsSectionModalOpen(true);
  };

  const handleAddItem = () => {
    if (activeSectionForAdd && newItemData.name.trim()) {
      onAddItem(service.id, activeSectionForAdd, newItemData);
      setNewItemData({ name: '', isMandatory: false, isOfflineOnly: false });
      setActiveSectionForAdd(null);
    }
  };

  const isSectionComplete = (section: ChecklistSection) => {
    if (section.items.length === 0) return false;
    return section.items.some(item => checkedState[item.id]);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
           {service.name}
        </h2>
        <p className="text-gray-500 mt-1">
          {isEditMode ? 'Manage your document requirements below.' : 'Please ensure you have the following documents ready.'}
        </p>
      </div>

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Empty State */}
        {service.sections.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
              <Building2 size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No sections yet</h3>
            <p className="text-gray-500 mb-6">Start by adding a category for documents.</p>
            {isEditMode && (
               <button
               onClick={handleOpenAddSection}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
             >
               Add First Section
             </button>
            )}
          </div>
        )}

        {/* Sections List */}
        {service.sections.map((section) => {
          const complete = isSectionComplete(section);
          const IconComponent = section.iconName ? SectionIconMap[section.iconName] || FileText : FileText;
          
          return (
            <div 
              key={section.id} 
              className={`bg-white rounded-xl shadow-sm border transition-all ${
                complete && !isEditMode ? 'border-green-200 shadow-green-50/50' : 'border-gray-200'
              }`}
            >
              {/* Section Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                 complete && !isEditMode ? 'bg-green-50/50 border-green-100' : 'bg-gray-50/50 border-gray-100'
              }`}>
                <div className="flex items-center gap-4">
                   {/* Icon or Image */}
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                     complete && !isEditMode ? 'bg-green-100 text-green-600' : 'bg-white border border-gray-200 text-blue-600'
                   }`}>
                     {section.imageUrl ? (
                       <img src={section.imageUrl} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <IconComponent size={20} />
                     )}
                   </div>
                   
                   <div>
                      <h3 className={`font-semibold text-lg flex items-center gap-2 ${complete && !isEditMode ? 'text-green-800' : 'text-gray-800'}`}>
                        {section.title}
                        {/* Completion Checkmark */}
                        {!isEditMode && complete && (
                          <CheckCircle2 size={18} className="text-green-600" />
                        )}
                      </h3>
                      {section.description && (
                        <p className="text-xs text-gray-500">{section.description}</p>
                      )}
                   </div>
                </div>

                {isEditMode && (
                   <div className="flex items-center gap-1">
                     <button 
                       onClick={() => handleOpenEditSection(section)}
                       className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                       title="Edit Category"
                     >
                       <Pencil size={18} />
                     </button>
                     <button 
                       onClick={() => {
                         if(window.confirm('Delete this section and all its items?')) onDeleteSection(service.id, section.id)
                       }}
                       className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                       title="Delete Section"
                     >
                       <Trash2 size={18} />
                     </button>
                   </div>
                )}
              </div>

              {/* Items List */}
              <div className="p-2">
                {section.items.map((item) => {
                  const isChecked = checkedState[item.id] || false;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`group flex items-center justify-between p-3 rounded-lg mb-1 transition-colors ${
                        isEditMode ? 'hover:bg-gray-50' : 'cursor-pointer hover:bg-gray-50'
                      } ${isChecked && !isEditMode ? 'bg-blue-50/30' : ''}`}
                      onClick={() => !isEditMode && onToggleItem(item.id)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Checkbox */}
                        {!isEditMode && (
                           <div className={`flex-shrink-0 w-5 h-5 border-2 rounded transition-colors flex items-center justify-center ${
                             isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                           }`}>
                             {isChecked && <CheckCircle2 size={14} className="text-white" />}
                           </div>
                        )}
                        
                        <div>
                          <p className={`text-sm font-medium ${isChecked && !isEditMode ? 'text-blue-900' : 'text-gray-700'}`}>
                            {item.name}
                          </p>
                          <div className="flex gap-2 mt-0.5">
                            {item.isMandatory && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                                Mandatory
                              </span>
                            )}
                            {item.isOfflineOnly && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                Offline Only
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Edit Actions */}
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm(`Delete item: ${item.name}?`)) onDeleteItem(service.id, section.id, item.id);
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Add Item Button (Edit Mode) */}
                {isEditMode && (
                  <button
                    onClick={() => setActiveSectionForAdd(section.id)}
                    className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm text-blue-600 font-medium border border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={16} /> Add Document
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Section Button (Edit Mode) */}
        {isEditMode && (
           <div className="flex justify-center pt-4 pb-12">
             <button
               onClick={handleOpenAddSection}
               className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 transition-transform active:scale-95"
             >
               <Plus size={20} /> Add New Category
             </button>
           </div>
        )}
      </div>

      {/* --- Modals --- */}
      
      {/* Add/Edit Section Modal */}
      <Modal 
        isOpen={isSectionModalOpen} 
        onClose={handleCloseSectionModal} 
        title={editingSectionId ? "Edit Category" : "Add New Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Title</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Proof of Identity"
              value={newSectionData.title}
              onChange={(e) => setNewSectionData({...newSectionData, title: e.target.value})}
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="e.g., Select one of the following"
              value={newSectionData.description}
              onChange={(e) => setNewSectionData({...newSectionData, description: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
             <div className="grid grid-cols-6 gap-2 mb-3">
               {AVAILABLE_ICONS.map((iconKey) => {
                 const Icon = SectionIconMap[iconKey];
                 const isSelected = newSectionData.iconName === iconKey;
                 return (
                   <button
                     key={iconKey}
                     onClick={() => setNewSectionData({...newSectionData, iconName: iconKey, imageUrl: ''})}
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
             <p className="text-center text-xs text-gray-400 mb-2">- OR -</p>
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">Custom Image URL</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="https://..."
                   value={newSectionData.imageUrl}
                   onChange={(e) => setNewSectionData({...newSectionData, imageUrl: e.target.value, iconName: ''})}
                 />
                 {newSectionData.imageUrl && (
                   <div className="w-9 h-9 rounded bg-gray-100 border overflow-hidden flex-shrink-0">
                     <img src={newSectionData.imageUrl} alt="Prev" className="w-full h-full object-cover" />
                   </div>
                 )}
               </div>
             </div>
          </div>

          <button 
            onClick={handleSaveSection}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium"
          >
            {editingSectionId ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </Modal>

      {/* Add Item Modal */}
      <Modal 
        isOpen={!!activeSectionForAdd} 
        onClose={() => setActiveSectionForAdd(null)} 
        title="Add Document Requirement"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Driving License"
              value={newItemData.name}
              onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
              autoFocus
            />
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <input 
              type="checkbox"
              id="isMandatory"
              checked={newItemData.isMandatory}
              onChange={(e) => setNewItemData({...newItemData, isMandatory: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isMandatory" className="text-sm text-gray-700 select-none">Mark as Mandatory?</label>
          </div>

          <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <input 
              type="checkbox"
              id="isOffline"
              checked={newItemData.isOfflineOnly}
              onChange={(e) => setNewItemData({...newItemData, isOfflineOnly: e.target.checked})}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <label htmlFor="isOffline" className="text-sm text-gray-700 select-none">Offline Submission Only?</label>
          </div>

          <button 
            onClick={handleAddItem}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium"
          >
            Add Document
          </button>
        </div>
      </Modal>
    </div>
  );
};
