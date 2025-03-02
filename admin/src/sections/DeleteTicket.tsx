import Modal from "../components/ui/Modal";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  ticketId,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="text-center">
        <FaExclamationTriangle className="mx-auto text-yellow-500 text-5xl mb-4" />
        <h3 className="text-lg font-medium mb-2">Delete Ticket?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete ticket #{ticketId?.slice(-5)}? This
          action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
