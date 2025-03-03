import React from "react";
import Modal from "../../components/ui/Modal";
import { FaExclamationCircle } from "react-icons/fa";
import { User } from "../../services/users/types";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading?: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete User"
      size="sm"
    >
      <div className="text-center">
        <FaExclamationCircle className="mx-auto text-red-500 text-5xl mb-4" />

        <h3 className="text-lg font-medium mb-2">Delete User Account?</h3>
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete the user account for:
        </p>
        <div className="font-medium text-gray-900 mb-6">
          {user.firstName} {user.lastName} ({user.email})
        </div>
        <p className="text-sm text-red-600 mb-4">
          This action cannot be undone. All data associated with this user
          will be permanently deleted.
        </p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="animate-spin mr-2">●</span> Deleting...
              </div>
            ) : (
              "Delete User"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;