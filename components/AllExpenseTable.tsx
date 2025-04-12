"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertTimestampToDate } from "@/utils";
import { Expense } from "@/dto";
import { useParams } from "next/navigation";
import { useDeleteExpense, useGetAllExpenses } from "@/hooks/use-expense-hook";
import { Ellipsis, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import ExpenseModal from "./ExpenseModal";
import { useGetVehicleById } from "@/hooks/use-vehicle-hook";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { downloadFile } from "@/hooks/use-fle-donwload";
import { SkeletonTable } from "./skeleton-table";
import { Error } from "./error";
import { useUserRole } from "@/hooks/use-get-role";
import { hasPermission } from "@/utils/permissions";

const AllExpenseTable = () => {
  const params = useParams();
  const { toast } = useToast();
  const { data: expensesList, isLoading } = useGetAllExpenses(
    params.id as string
  );
  const [currentExpense, setCurrentExpense] = useState<Expense | undefined>(
    undefined
  );
  const {
    data: vehicle,
    isLoading: isVehicleLoading,
    isError,
  } = useGetVehicleById(params.id as string);
  const { mutateAsync: deleteExpense } = useDeleteExpense();
  const role = useUserRole();
  const [openEditModal, setOpenEditModal] = useState(false);

  if (isLoading || isVehicleLoading) {
    return <SkeletonTable />;
  }

  if (!vehicle || isError) {
    return <Error />;
  }

  const handleDeleteExpense = (expenseId: string) => {
    console.log("delete");
    deleteExpense(expenseId)
      .then(() => {
        toast({
          title: "Expense deleted successfully",
        });
      })
      .catch((err) => {
        toast({
          title: "Uh Oh! Something went wrong",
          description: `Failed to upload vehicle data, ${err.message}`,
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <Table>
        <TableCaption>A list of all your expenses </TableCaption>
        <TableHeader className="bg-white py-4">
          <TableRow>
            <TableHead className="font-semibold text-black">No.</TableHead>
            <TableHead className="font-semibold text-black">
              Expense Type
            </TableHead>
            <TableHead className="font-semibold text-black">
              Description
            </TableHead>
            <TableHead className="font-semibold text-black">
              Expense Date
            </TableHead>
            <TableHead className="font-semibold text-black">Amount</TableHead>
            <TableHead className="font-semibold text-black">Document</TableHead>

            <TableHead className="font-semibold text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expensesList.expenses.map((expense: Expense, index: number) => {
            return (
              <TableRow className="h-16" key={expense.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{expense.type}</TableCell>
                <TableCell className="max-w-[200px]">
                  {expense.description}
                </TableCell>
                <TableCell>{convertTimestampToDate(expense.date)}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>
                  <Button onClick={() => downloadFile(expense.file_url)}>
                    View
                  </Button>
                </TableCell>
                <TableCell onClick={() => {}} className=" cursor-pointer">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent alignOffset={20}>
                      {role && hasPermission("expense", "edit", role) && (
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentExpense(expense);
                            setOpenEditModal(true);
                          }}
                        >
                          <Pencil1Icon className="size-8" />
                          Edit Expense
                        </DropdownMenuItem>
                      )}
                      {role && hasPermission("expense", "delete", role) && (
                        <DropdownMenuItem
                          onClick={() => {
                            handleDeleteExpense(expense.id);
                          }}
                        >
                          <Trash2Icon className="size-8" />
                          Delete Expense
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ExpenseModal
        expense={currentExpense}
        vehicle={vehicle}
        type="edit"
        isModalOpen={openEditModal}
        setIsModalOpen={setOpenEditModal}
      />
    </>
  );
};

export default AllExpenseTable;
