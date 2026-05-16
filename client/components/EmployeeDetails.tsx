import { Employee } from "@shared/api";
import { Edit2, Trash2, Mail, Hash, Briefcase, Cake } from "lucide-react";
import GravatarAvatar from "./GravatarAvatar";

interface EmployeeDetailsProps {
  employee: Employee;
  allEmployees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeDetails({
  employee,
  allEmployees,
  onEdit,
  onDelete,
}: EmployeeDetailsProps) {
  const manager = allEmployees.find((emp) => emp.id === employee.managerId);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDirectReports = () => {
    return allEmployees.filter((emp) => emp.managerId === employee.id);
  };

  const directReports = getDirectReports();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 dark:from-primary/20 to-primary/10 dark:to-primary/10 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-center mb-4">
          <GravatarAvatar
            email={employee.email}
            name={`${employee.firstName} ${employee.lastName}`}
            size="lg"
          />
        </div>
        <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">
          {employee.firstName} {employee.lastName}
        </h2>
        <p className="text-center text-primary font-medium mt-1">{employee.role}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Key Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Hash className="h-5 w-5 text-gray-400 dark:text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold">
                Employee Number
              </p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.employeeNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold">
                Salary
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatSalary(employee.salary)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Cake className="h-5 w-5 text-gray-400 dark:text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold">
                Date of Birth
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(employee.birthDate)}
              </p>
            </div>
          </div>

          {employee.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 dark:text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold">
                  Email
                </p>
                <p className="font-medium text-primary break-all">
                  <a href={`mailto:${employee.email}`}>{employee.email}</a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Hierarchy Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {manager && (
            <div>
              <p className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold mb-2">
                Reports To
              </p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <GravatarAvatar
                  email={manager.email}
                  name={`${manager.firstName} ${manager.lastName}`}
                  size="sm"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {manager.firstName} {manager.lastName} ({manager.employeeNumber})
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{manager.role}</p>
                </div>
              </div>
            </div>
          )}

          {directReports.length > 0 && (
            <div>
              <p className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold mb-2">
                Direct Reports ({directReports.length})
              </p>
              <div className="space-y-2">
                {directReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <GravatarAvatar
                      email={report.email}
                      name={`${report.firstName} ${report.lastName}`}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {report.firstName} {report.lastName} ({report.employeeNumber})
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{report.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={() => onEdit(employee)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => {
            if (
              window.confirm(
                `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
              )
            ) {
              onDelete(employee.id);
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
