import { useState, useMemo } from "react";
import { Employee } from "@shared/api";
import { Search, ChevronDown, ChevronRight, Edit2, Trash2  } from "lucide-react";
import GravatarAvatar from "@/components/GravatarAvatar";
import { api, employeesData } from "../../shared/api";
import { useEffect } from "react";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeDetails from "@/components/EmployeeDetails";

export default function Hierarchy() {
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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["1"])
  );
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const rootEmployees = useMemo(
    () => employees.filter((emp) => !emp.managerId),
    [employees]
  );

  const getDirectReports = (managerId: string) => {
    return employees.filter((emp) => emp.managerId === managerId);
  };

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

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

  const searchMatches = (employee: Employee, term: string) => {
    if (term === "") return true;
    const lowerTerm = term.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(lowerTerm) ||
      employee.lastName.toLowerCase().includes(lowerTerm) ||
      employee.role.toLowerCase().includes(lowerTerm) ||
      employee.employeeNumber.toLowerCase().includes(lowerTerm)
    );
  };

  const hasMatchingDescendant = (employee: Employee, term: string): boolean => {
    if (searchMatches(employee, term)) return true;
    const directReports = getDirectReports(employee.id);
    return directReports.some((report) => hasMatchingDescendant(report, term));
  };

  useMemo(() => {
    if (searchTerm === "") {
      setExpandedNodes(new Set(["1"]));
    } else {
      const nodesToExpand = new Set<string>();
      employees.forEach((emp) => {
        if (hasMatchingDescendant(emp, searchTerm)) {
          nodesToExpand.add(emp.id);
        }
      });
      setExpandedNodes(nodesToExpand);
    }
  }, [searchTerm]);

  const HierarchyNode = ({ employee, level = 0 }: { employee: Employee; level?: number }) => {
    const directReports = getDirectReports(employee.id);
    const isExpanded = expandedNodes.has(employee.id);
    const matches = searchMatches(employee, searchTerm);
    const hasMatchingChild = directReports.some((report) =>
      hasMatchingDescendant(report, searchTerm)
    );

    if (!matches && !hasMatchingChild && searchTerm !== "") return null;

    const hasChildren = directReports.length > 0;

    return (
      <div key={employee.id} className="relative">
        {level > 0 && (
          <div
            className="absolute left-5 top-0 w-px h-full bg-gray-300 dark:bg-gray-600"
            style={{ height: "100%" }}
          />
        )}

        <div className="mb-4">
          <div className="flex items-start gap-3 relative">
            {level > 0 && (
              <div className="absolute -left-6 top-8 w-6 h-px bg-gray-300 dark:bg-gray-600" />
            )}

            {hasChildren && (
              <button
                onClick={() => toggleNode(employee.id)}
                className="mt-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}

            {!hasChildren && <div className="w-6 flex-shrink-0" />}

            <div
              className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              style={{ marginLeft: `${level * 2}rem` }}
            >
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <GravatarAvatar 
                    email={employee.email} 
                    name={`${employee.firstName} ${employee.lastName}`}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-primary" onClick={() => setSelectedEmployee(employee)}>
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-primary font-medium">{employee.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{employee.employeeNumber}</p>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEmployee(employee);
                    }}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
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
                        handleDeleteEmployee(employee.id);
                      }
                    }}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isExpanded && hasChildren && (
            <div className="mt-4 ml-6 border-l border-gray-300 dark:border-gray-600 pl-4">
              {directReports
                .filter(
                  (report) =>
                    searchTerm === "" ||
                    searchMatches(report, searchTerm) ||
                    hasMatchingDescendant(report, searchTerm)
                )
                .map((report) => (
                  <HierarchyNode
                    key={report.id}
                    employee={report}
                    level={level + 1}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Organization Hierarchy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View the reporting structure and hierarchy of your organization
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, role, or employee number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Add Employee
                </button>
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing employees matching "{searchTerm}"
                </p>
              )}
            </div>

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

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              {rootEmployees.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p>No employees in the organization</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rootEmployees.map((emp) => (
                    <HierarchyNode key={emp.id} employee={emp} level={0} />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {employees.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Management Levels</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {
                    new Set(
                      employees
                        .map((emp) => {
                          let level = 0;
                          let current = emp;
                          while (
                            current.managerId &&
                            employees.find((e) => e.id === current.managerId)
                          ) {
                            level++;
                            current = employees.find(
                              (e) => e.id === current.managerId
                            )!;
                          }
                          return level;
                        })
                        .filter((l) => l > 0)
                    ).size + 1
                  }
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Executives (No Manager)</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {rootEmployees.length}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedEmployee ? (
              <EmployeeDetails
                employee={selectedEmployee}
                allEmployees={employees}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center sticky top-8">
                <div className="text-gray-400 dark:text-gray-600 mb-2 flex justify-center">
                  <ChevronDown className="h-12 w-12" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">No Employee Selected</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click on an employee from the hierarchy to view their details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}