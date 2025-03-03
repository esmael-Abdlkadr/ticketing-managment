import React from "react";
import Modal from "../../components/ui/Modal";
import { User } from "../../services/users/types";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-medium mr-4">
            {user.firstName?.[0] || ''}
            {user.lastName?.[0] || ''}
          </div>
          <div>
            <h3 className="text-lg font-medium">{user.firstName} {user.lastName}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p>{user.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p>{user.isActive ? 'Active' : 'Inactive'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created On</p>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Login</p>
            <p>
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "Never"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-md font-medium mb-2">Recent Activity</h4>
          <p className="text-gray-500 italic">
            Activity tracking will be implemented in a future update.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewUserModal;