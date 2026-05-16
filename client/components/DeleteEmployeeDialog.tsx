import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type Props = {
  employeeId: string;
  employeeName: string;
  onDelete: (id: string) => Promise<void>;
  children: React.ReactNode;
};

export default function DeleteEmployeeDialog({
  employeeId,
  employeeName,
  onDelete,
  children
}: Props) {

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Employee
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>{employeeName}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
                Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={async () => {
                try {
                setIsDeleting(true);

                await onDelete(employeeId);

                } finally {
                setIsDeleting(false);
                }
            }}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}