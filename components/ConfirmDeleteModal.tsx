'use client';

interface ConfirmDeleteModalProps {
  domainName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ domainName, onClose, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-red-50 border-b border-red-100">
          <h3 className="text-lg font-bold text-red-800">Confirm Deletion</h3>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-700">
          <p className="mb-4">
            Are you sure you want to permanently delete the domain:
          </p>
          <p className="font-bold text-lg text-red-700 break-words">"{domainName}"</p>
          <p className="mt-4 text-sm text-gray-500">
            This action cannot be undone and will remove it from your inventory.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Yes, Delete Domain
          </button>
        </div>
      </div>
    </div>
  );
}