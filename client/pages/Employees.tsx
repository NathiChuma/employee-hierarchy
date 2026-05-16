import { useState, useMemo, useEffect } from "react";
import { Employee } from "@shared/api";
import { Plus, Search, Filter, Users } from "lucide-react";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeeDetails from "@/components/EmployeeDetails";
import { cn } from "@/lib/utils";
import { api, employeesData } from "../../shared/api";

export default function Employees() {

  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchData = async () => {

      if (employeesData.length === 0) {
        await api.getEmployees();
      }

      const employees = employeesData;

      if (employees) {
        setEmployees(employees);
      }

    };

    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const roles = useMemo(() => {
    const uniqueRoles = new Set(employees.map((e) => e.role));
    return Array.from(uniqueRoles).sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        searchTerm === "" ||
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "" || emp.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, filterRole]);

  const handleAddEmployee = async (formData: Employee) => {
    if (editingId) {
      await api.updateEmployee(formData);
      setEmployees(employeesData);
      setEditingId(null);
    } else {
      await api.createEmployee(formData);
      setEmployees(employeesData);
    }
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = async (id: string) => {
    await api.deleteEmployee(id);
    setEmployees(employeesData);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditingId(employee.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">Manage your organization's employee directory and hierarchy</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or employee number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">All Roles</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setShowForm(!showForm);
                      setEditingId(null);
                      setSelectedEmployee(null);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
                      showForm
                        ? "bg-gray-200 text-gray-800"
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                  >
                    <Plus className="h-5 w-5" />
                    Add Employee
                  </button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredEmployees.length} of {employees.length} employees
              </div>
            </div>

            {/* Form Section */}
            {showForm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {editingId ? "Edit Employee" : "Add New Employee"}
                </h2>
                <EmployeeForm
                  employees={employees}
                  initialData={selectedEmployee}
                  onSubmit={handleAddEmployee}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setSelectedEmployee(null);
                  }}
                />
              </div>
            )}

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <EmployeeTable
                employees={filteredEmployees}
                onSelectEmployee={setSelectedEmployee}
                onEditEmployee={handleEditEmployee}
                onDeleteEmployee={handleDeleteEmployee}
              />
            </div>
          </div>

          {/* Sidebar - Employee Details */}
          <div className="lg:col-span-1">
            {selectedEmployee ? (
              <EmployeeDetails
                employee={selectedEmployee}
                allEmployees={employees}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-gray-400 dark:text-gray-600 mb-2 flex justify-center">
                  <Users className="h-12 w-12" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">No Employee Selected</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click on an employee from the table to view their details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
