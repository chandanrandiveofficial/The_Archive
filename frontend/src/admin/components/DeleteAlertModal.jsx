import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BiTrash } from 'react-icons/bi';

const DeleteAlertModal = ({ open, onOpenChange, productName, onConfirm }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-white">
        <AlertDialogHeader>
          {/* Warning Icon */}
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BiTrash className="w-6 h-6 text-black" />
          </div>

          {/* Title */}
          <AlertDialogTitle className="text-center text-xl font-bold text-black">
            Delete Product
          </AlertDialogTitle>

          {/* Description */}
          <AlertDialogDescription className="text-center text-sm text-[#333333] leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-black">"{productName}"</span>?
            <br />
            This action will permanently remove the item from the catalog.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Actions */}
        <AlertDialogFooter className="flex-row gap-3 sm:gap-3">
          <AlertDialogCancel className="flex-1 m-0 bg-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 bg-black text-white hover:bg-[#333333] m-0"
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertModal;
