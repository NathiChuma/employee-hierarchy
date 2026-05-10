export interface DemoResponse {
  message: string;
}

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

export interface EmployeeCreateRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  employeeNumber: string;
  salary: number;
  role: string;
  managerId?: string;
  email?: string;
}

export interface EmployeeUpdateRequest extends Partial<EmployeeCreateRequest> {
  id: string;
}

const API_BASE_URL = "https://employee-hierarchy-backend.vercel.app";

export var employeesData: Employee[] = [];

export class EmployeesAPIs {

  async getEmployees(){

    const apiUrl = API_BASE_URL + '/employees/getEmployees';

    await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Required for backend to parse JSON
      }
    })
    .then(response => response.json())
    .then(data => {

      if (data.error == undefined){
          employeesData = data as Employee[];
      }

    })
    .catch(error => console.error('Error:', error));

  }

  async createEmployee(employeeData: Employee) {
    const apiUrl = API_BASE_URL + '/employees/createEmployee';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to create employee: ' + response.statusText);
    }

    await response.json().then(data => {
      employeesData.push(data.employee as Employee);
    });
  }

  async updateEmployee(employeeData: Employee) {
    const apiUrl = API_BASE_URL + '/employees/updateEmployee/' + employeeData.id;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee: ' + response.statusText);
    }

    employeesData = employeesData.map((emp) => (emp.id === employeeData.id ? employeeData : emp));
  }

  async deleteEmployee(id: string) {
    const apiUrl = API_BASE_URL + '/employees/deleteEmployee/' + id;

      const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to delete employee: ' + response.statusText);
      }

      employeesData = employeesData.filter((emp) => emp.id !== id);
  }

}