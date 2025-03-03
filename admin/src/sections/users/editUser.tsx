import React from "react";
import Modal from "../../components/ui/Modal";
import { UserRole } from "../../services/users/types";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

interface CreateEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isCreating: boolean;
  isLoading: boolean;
}

const CreateEditUserModal: React.FC<CreateEditUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isCreating,
  isLoading,
}) => {
  const ROLE_OPTIONS = Object.values(UserRole);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreating ? "Invite User" : "Edit User"}
      size="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded-lg p-2"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            className="w-full border rounded-lg p-2"
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value as UserRole }))
            }
            required
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role === UserRole.SUPPORT_AGENT 
                  ? "Support Agent"
                  : role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {isCreating && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-sm">
            <p>
              <span className="font-medium">Note:</span> An invitation email will be sent to this user.
              They will need to click the link in the email and set their password to complete registration.
            </p>
          </div>
        )}

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
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="animate-spin mr-2">●</span> 
                {isCreating ? "Inviting..." : "Saving..."}
              </div>
            ) : (
              isCreating ? "Send Invitation" : "Save Changes"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEditUserModal;