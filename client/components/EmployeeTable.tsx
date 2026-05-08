import { Employee } from "@shared/api";
import { Edit2, Trash2 } from "lucide-react";
import GravatarAvatar from "./GravatarAvatar";

interface EmployeeTableProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function EmployeeTable({
  employees,
  onSelectEmployee,
  onEditEmployee,
  onDeleteEmployee,
}: EmployeeTableProps) {
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (employees.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 text-lg">No employees found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Employee #
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Birth Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Salary
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, idx) => (
            <tr
              key={employee.id}
              className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/50 dark:bg-gray-700/30"
              }`}
              onClick={() => onSelectEmployee(employee)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <GravatarAvatar email={employee.email} name={`${employee.firstName} ${employee.lastName}`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {employee.employeeNumber}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {employee.role}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {formatDate(employee.birthDate)}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {formatSalary(employee.salary)}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEmployee(employee);
                    }}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
                        )
                      ) {
                        onDeleteEmployee(employee.id);
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
