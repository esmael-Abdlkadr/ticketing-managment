import React from "react";
import { FaEye, FaUserEdit, FaUserTag, FaTrash } from "react-icons/fa";
import { User } from "../../services/users/types";

interface UserActionButtonsProps {
  selectedUserId: string | null;
  selectedUser: User | null;
  onViewUser: () => void;
  onEditUser: () => void;
  onAssignRole: () => void;
  onDeleteUser: () => void;
  onClearSelection: () => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  selectedUserId,
  selectedUser,
  onViewUser,
  onEditUser,
  onAssignRole,
  onDeleteUser,
  onClearSelection
}) => {
  return (
    <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2">
      <button
        onClick={onViewUser}
        disabled={!selectedUserId}
        className={`px-3 py-1.5 rounded-md flex items-center ${
          selectedUserId
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        <FaEye className="mr-1" /> View Details
      </button>
      
      <button
        onClick={onEditUser}
        disabled={!selectedUserId}
        className={`px-3 py-1.5 rounded-md flex items-center ${
          selectedUserId
            ? "bg-yellow-600 text-white hover:bg-yellow-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        <FaUserEdit className="mr-1" /> Edit
      </button>
      
      <button
        onClick={onAssignRole}
        disabled={!selectedUserId}
        className={`px-3 py-1.5 rounded-md flex items-center ${
          selectedUserId
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        <FaUserTag className="mr-1" /> Assign Role
      </button>
      
      <button
        onClick={onDeleteUser}
        disabled={!selectedUserId}
        className={`px-3 py-1.5 rounded-md flex items-center ${
          selectedUserId
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        <FaTrash className="mr-1" /> Delete
      </button>
      
      {selectedUserId && selectedUser && (
        <div className="ml-auto text-sm text-gray-600 flex items-center">
          Selected: {selectedUser.firstName} {selectedUser.lastName}
          <button 
            onClick={onClearSelection}
            className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-full p-1"
            title="Clear selection"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default UserActionButtons;