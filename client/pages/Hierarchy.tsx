import { useState, useMemo } from "react";
import { Employee } from "@shared/api";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import GravatarAvatar from "@/components/GravatarAvatar";
import { getEmployees } from "@/lib/apis";
import { useEffect } from "react";

export default function Hierarchy() {

  const [employees, setEmployees] = useState<Employee[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
  
        const employees = await getEmployees();
  
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

  // Check if any descendant matches the search term
  const hasMatchingDescendant = (employee: Employee, term: string): boolean => {
    if (searchMatches(employee, term)) return true;
    const directReports = getDirectReports(employee.id);
    return directReports.some((report) => hasMatchingDescendant(report, term));
  };

  // Auto-expand nodes when searching
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

    // Show node if it matches or has matching descendants
    if (!matches && !hasMatchingChild && searchTerm !== "") return null;

    const hasChildren = directReports.length > 0;

    return (
      <div key={employee.id} className="relative">
        {/* Vertical line for all but last item */}
        {level > 0 && (
          <div
            className="absolute left-5 top-0 w-px h-full bg-gray-300"
            style={{ height: "100%" }}
          />
        )}

        <div className="mb-4">
          {/* Node */}
          <div className="flex items-start gap-3 relative">
            {/* Connection lines */}
            {level > 0 && (
              <div className="absolute -left-6 top-8 w-6 h-px bg-gray-300" />
            )}

            {/* Expand/collapse button */}
            {hasChildren && (
              <button
                onClick={() => toggleNode(employee.id)}
                className="mt-2 p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
            )}

            {!hasChildren && <div className="w-6 flex-shrink-0" />}

            {/* Employee Card */}
            <div
              className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              style={{ marginLeft: `${level * 2}rem` }}
            >
              <div className="flex items-center gap-3">
                <GravatarAvatar 
                  email={employee.email} 
                  name={`${employee.firstName} ${employee.lastName}`}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-primary font-medium">{employee.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{employee.employeeNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Children */}
          {isExpanded && hasChildren && (
            <div className="mt-4 ml-6 border-l border-gray-300 pl-4">
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
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Organization Hierarchy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View the reporting structure and hierarchy of your organization
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Search */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, role, or employee number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Showing employees matching "{searchTerm}"
            </p>
          )}
        </div>

        {/* Hierarchy Tree */}
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

        {/* Statistics */}
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
    </div>
  );
}
