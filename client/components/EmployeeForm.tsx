import { useState } from "react";
import { Employee } from "@shared/api";

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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.birthDate) newErrors.birthDate = "Birth date is required";
    if (!formData.employeeNumber.trim())
      newErrors.employeeNumber = "Employee number is required";
    if (formData.salary <= 0) newErrors.salary = "Salary must be greater than 0";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = "Please enter a valid email address";

    //check for duplicate email addresses
    if (
      formData.email.trim() &&
      validateEmail(formData.email) &&
      employees.some(
        (emp) =>
          emp.email === formData.email &&
          emp.id !== formData.id
      )
    ) {
      newErrors.email = "Email address already exists";
    }

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

    // Check for circular management (simple check to prevent direct loops)
    if (formData.managerId) {
      let manager = employees.find((emp) => emp.id === formData.managerId);
      while (manager) {
        if (manager.id === formData.id) {
          newErrors.managerId = "Circular management relationship detected";
          break;
        }
        manager = employees.find((emp) => emp.id === manager?.managerId);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      onSubmit(formData);
    }else{
      setIsLoading(false);
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
            max={new Date().toISOString().split("T")[0]}
            min="1900-01-01"
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
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
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
                  {emp.firstName} {emp.lastName} ({emp.employeeNumber})
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
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            initialData ? "Update Employee" : "Add Employee"
          )}
        </button>
      </div>
    </form>
  );
}
