import { useState } from "react";
import { Employee } from "@shared/api";
import { X } from "lucide-react";

interface EmployeeFormProps {
  employees: Employee[];
  initialData?: Employee | null;
  onSubmit: (data: Employee) => void;
  onCancel: () => void;
}

export default function EmployeeForm({
  employees,
  initialData,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<Employee>(
    initialData || {
      id: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      employeeNumber: "",
      salary: 0,
      role: "",
      email: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.birthDate) newErrors.birthDate = "Birth date is required";
    if (!formData.employeeNumber.trim())
      newErrors.employeeNumber = "Employee number is required";
    if (formData.salary <= 0) newErrors.salary = "Salary must be greater than 0";
    if (!formData.role.trim()) newErrors.role = "Role is required";

    // Check for duplicate employee numbers
    if (
      employees.some(
        (emp) =>
          emp.employeeNumber === formData.employeeNumber &&
          emp.id !== formData.id
      )
    ) {
      newErrors.employeeNumber = "Employee number already exists";
    }

    // Check that employee is not their own manager
    if (formData.managerId && formData.managerId === formData.id) {
      newErrors.managerId = "Employee cannot be their own manager";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.firstName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.lastName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Birth Date
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.birthDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Employee Number
          </label>
          <input
            type="text"
            value={formData.employeeNumber}
            onChange={(e) =>
              setFormData({ ...formData, employeeNumber: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.employeeNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.employeeNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.employeeNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Salary
          </label>
          <input
            type="number"
            value={formData.salary || ""}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({
                ...formData,
                salary: value === "" ? 0 : parseFloat(value),
              });
            }}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.salary ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.salary && (
            <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role / Position
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.role ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Manager (Optional)
          </label>
          <select
            value={formData.managerId || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                managerId: e.target.value || undefined,
              })
            }
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.managerId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">No Manager</option>
            {employees
              .filter((emp) => emp.id !== formData.id)
              .map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
          </select>
          {errors.managerId && (
            <p className="text-red-500 text-sm mt-1">{errors.managerId}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {initialData ? "Update Employee" : "Add Employee"}
        </button>
      </div>
    </form>
  );
}
