import { Employee } from "@shared/api";

//const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://employee-hierarchy-backend.vercel.app";

export var employeesData: Employee[] = [];

export class EmployeesAPIs {

  async getEmployees(){

    const apiUrl = API_BASE_URL + '/employees/getEmployees';

    console.log('Fetching employees from API...');

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

    console.log('Fetched employees:', employeesData);
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

    console.log('Updating employee with data:', employeeData);

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

/*
export const employeesData: Employee[] = [];

export async function getEmployees(): Promise<Employee[]> {

  const apiUrl = API_BASE_URL + '/employees/getEmployees';

  var employees: Employee[] = [];

  await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', // Required for backend to parse JSON
    }
  })
  .then(response => response.json())
  .then(data => {

    if (data.error == undefined){
        employees = data as Employee[];
    }

  })
  .catch(error => console.error('Error:', error));

  return employees;
}

export async function createEmployee(employeeData: Employee): Promise<Employee> {
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

  var responseData: Employee;

  await response.json().then(data => {
    responseData = data.employee as Employee;
  });

  return responseData;
}

export async function updateEmployee(employeeData: Employee) {
  const apiUrl = API_BASE_URL + '/employees/updateEmployee/' + employeeData.id;

  console.log('Updating employee with data:', employeeData);

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
}

export async function deleteEmployee(id: string) {
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
}*/