export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  employeeNumber: string;
  salary: number;
  role: string;
  managerId?: string;
  email?: string;
}

export var employeesData: Employee[] = [];

class APIClient {

  API_BASE_URL: string;

  constructor() {
    this.API_BASE_URL = "https://employee-hierarchy-backend.vercel.app";
  }

  async getEmployees(){

    const apiUrl = this.API_BASE_URL + '/employees/getEmployees';

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Required for backend to parse JSON
      }
    });

    if (!response.ok) {
      throw new Error(
        'Failed to fetch employees: ' + await response.text()
      );
    }

    employeesData = await response.json() as Employee[];
  }

  async createEmployee(employeeData: Employee) {
    const apiUrl = this.API_BASE_URL + '/employees/createEmployee';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(
        'Failed to create employee: ' + await response.text()
      );
    }

    const data = await response.json();
    employeesData.push(data.employee as Employee);
  }

  async updateEmployee(employeeData: Employee) {
    const apiUrl = this.API_BASE_URL + '/employees/updateEmployee/' + employeeData.id;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(
        'Failed to update employee: ' + await response.text()
      );
    }

    employeesData = employeesData.map((emp) => (emp.id === employeeData.id ? employeeData : emp));

  }

  async deleteEmployee(id: string) {
    const apiUrl = this.API_BASE_URL + '/employees/deleteEmployee/' + id;

    const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
      throw new Error(
        'Failed to delete employee: ' + await response.text()
      );
    }

    const data = await response.json();
    employeesData = data.employees as Employee[];
  }

}

// Export a single instance of the APIClient class to be used throughout the application
export const api = new APIClient();