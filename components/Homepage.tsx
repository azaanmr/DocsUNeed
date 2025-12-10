import React from 'react';
import { Service } from '../types';
import { FileText, ArrowRight, CheckCircle2, Building2, Vote, Fingerprint, Briefcase, Globe, Landmark, GraduationCap, Plane, CreditCard, Home, User } from 'lucide-react';

interface HomepageProps {
  services: Service[];
  onSelectService: (id: string) => void;
}

// Reusing the icon map for consistency
const ServiceIconMap: Record<string, React.ElementType> = {
  Vote, Fingerprint, Briefcase, Globe, FileText, 
  Landmark, GraduationCap, Plane, Building2, CreditCard, Home, User
};

export const Homepage: React.FC<HomepageProps> = ({ services, onSelectService }) => {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero / Header Section */}
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-2">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/1632/1632670.png" 
              alt="DocsUNeed Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              DocsUNeed
            </h1>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">
              Document Requirements Made Simple
            </h2>
            <p className="text-lg text-gray-500">
              Select a service category below to view the complete checklist of mandatory and optional documents.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {services.map((service) => {
            const IconComponent = ServiceIconMap[service.iconName] || FileText;
            const sectionCount = service.sections.length;
            const itemCount = service.sections.reduce((acc, sec) => acc + sec.items.length, 0);

            return (
              <div 
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <IconComponent size={28} />
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                    {sectionCount} Categories
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                
                <p className="text-gray-500 text-sm mb-6 flex-1">
                  Includes checklists for {sectionCount} categories with a total of {itemCount} potential documents required.
                </p>

                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  View Checklist <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            );
          })}

          {/* Empty State if no services */}
          {services.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No services available yet.</p>
              <p className="text-sm text-gray-400 mt-1">Login as Admin to create one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
