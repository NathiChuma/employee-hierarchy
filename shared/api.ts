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
