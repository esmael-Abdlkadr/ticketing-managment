import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { UserRole } from "../../services/users/types";

// Constants
const ROLE_OPTIONS = Object.values(UserRole);
const STATUS_OPTIONS = ["active", "inactive", "blocked"];

interface UserFiltersProps {
  filters: {
    search: string;
    role: string;
    status: string;
  };
  isFilterExpanded: boolean;
  onFilterChange: (key: string, value: string) => void;
  onToggleFilters: () => void;
  onSearch: (e: React.FormEvent) => void;
  onClearFilters: () => void;
}

const UserFilterForm: React.FC<UserFiltersProps> = ({
  filters,
  isFilterExpanded,
  onFilterChange,
  onToggleFilters,
  onSearch,
  onClearFilters,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={onSearch} className="w-full md:w-auto flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <button 
              type="submit"
              className="absolute right-2 top-2 bg-blue-600 text-white p-1 rounded-md"
            >
              Go
            </button>
          </div>
        </form>

        {/* Filter toggle button */}
        <button
          onClick={onToggleFilters}
          className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          <FaFilter className="mr-2" />
          {isFilterExpanded ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Expanded filters */}
      {isFilterExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full border rounded-lg p-2"
              value={filters.role}
              onChange={(e) => onFilterChange('role', e.target.value)}
            >
              <option value="all">All Roles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border rounded-lg p-2"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={onSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2"
            >
              Apply Filters
            </button>
            <button
              onClick={onClearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilterForm;