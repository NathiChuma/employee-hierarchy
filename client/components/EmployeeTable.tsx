import { useState } from "react";
import { Employee } from "@shared/api";
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import GravatarAvatar from "./GravatarAvatar";

type SortField = "name" | "employeeNumber" | "role" | "birthDate" | "salary";
type SortDirection = "asc" | "desc";

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
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortField) {
      case "name":
        aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
        bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
        break;
      case "employeeNumber":
        aVal = a.employeeNumber;
        bVal = b.employeeNumber;
        break;
      case "role":
        aVal = a.role.toLowerCase();
        bVal = b.role.toLowerCase();
        break;
      case "birthDate":
        aVal = new Date(a.birthDate).getTime();
        bVal = new Date(b.birthDate).getTime();
        break;
      case "salary":
        aVal = a.salary;
        bVal = b.salary;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
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
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">
              <button
                onClick={() => handleSort("name")}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                Employee
                <SortIcon field="name" />
              </button>
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">
              <button
                onClick={() => handleSort("employeeNumber")}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                Emp #
                <SortIcon field="employeeNumber" />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">
              <button
                onClick={() => handleSort("role")}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                Role
                <SortIcon field="role" />
              </button>
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">
              <button
                onClick={() => handleSort("birthDate")}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                DOB
                <SortIcon field="birthDate" />
              </button>
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">
              <button
                onClick={() => handleSort("salary")}
                className="flex items-center justify-end gap-1 w-full hover:text-primary transition-colors"
              >
                Salary
                <SortIcon field="salary" />
              </button>
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((employee, idx) => (
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
              <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {employee.employeeNumber}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {employee.role}
              </td>
              <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {formatDate(employee.birthDate)}
              </td>
              <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white text-right whitespace-nowrap">
                {formatSalary(employee.salary)}
              </td>
              <td className="px-3 py-4">
                <div className="flex justify-end gap-1">
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
