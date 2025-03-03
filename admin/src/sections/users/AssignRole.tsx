import React from "react";
import Modal from "../../components/ui/Modal";
import { FaUserTag } from "react-icons/fa";
import { User, UserRole } from "../../services/users/types";

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  user: User | null;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  selectedRole,
  setSelectedRole,
  isLoading,
}) => {
  if (!user) return null;
  
  const ROLE_OPTIONS = Object.values(UserRole);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Role"
      size="sm"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
            {user.firstName?.[0] || ''}
            {user.lastName?.[0] || ''}
          </div>
          <div>
            <div className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Role
          </label>
          <div className="text-sm text-gray-900 mb-4">
            <span
              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${
                user.role === UserRole.ADMIN
                  ? "bg-purple-100 text-purple-800"
                  : user.role === UserRole.SUPPORT_AGENT
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {user.role}
            </span>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Role
          </label>
          <select
            className="w-full border rounded-lg p-2"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            required
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>

          <div className="mt-4 text-xs text-gray-500">
            <div className="font-medium mb-1">Role permissions:</div>
            <ul className="list-disc list-inside">
              <li>
                <strong>Admin:</strong> Full access to all features
              </li>
              <li>
                <strong>Support:</strong> Can manage tickets and users
              </li>
              <li>
                <strong>User:</strong> Can create and view tickets
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || (user && selectedRole === user.role)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="animate-spin mr-2">●</span> Assigning...
              </div>
            ) : (
              <>
                <FaUserTag className="inline mr-1" /> Assign Role
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignRoleModal;