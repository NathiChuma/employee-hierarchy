import { Employee } from "@shared/api";

const API_BASE_URL = "https://employee-hierarchy-backend.vercel.app";

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
}