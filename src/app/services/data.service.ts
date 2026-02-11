import { Injectable, signal } from '@angular/core';
import data from '../../assets/data.json';

export interface Employee {
  id: number;
  name: string;
  skillIds: number[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  skills = signal(data.skills);
  jobs = signal(data.jobs);
  employees = signal(data.employees);

  // ➕ Add new employee
  addEmployee(employee: Employee) {
    const current = this.employees();

    const newEmployee: Employee = {
      ...employee,
      id: employee.id || this.getNextEmployeeId(current)
    };

    this.employees.set([...current, newEmployee]);
  }

  // ✏️ Update employee
  updateEmployee(employee: Employee) {
    this.employees.set(
      this.employees().map(e =>
        e.id === employee.id ? { ...employee } : e
      )
    );
  }

  // 🔢 Next ID
  private getNextEmployeeId(employees: Employee[]): number {
    return employees.length
      ? Math.max(...employees.map(e => e.id)) + 1
      : 1;
  }
}
