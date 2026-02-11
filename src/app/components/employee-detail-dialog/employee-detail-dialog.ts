import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../services/data.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './employee-detail-dialog.html'
})
export class EmployeeDialogComponent {

  isEdit = computed(() => !!this.data?.employee);

  // name = signal(this.data?.employee?.name ?? '');
  // skillIds = signal<number[]>(this.data?.employee?.skillIds ?? []);
  name = signal('');
  skillIds = signal<number[]>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    public dataService: DataService
  ) {
    // ✅ inicialización segura
    if (data?.employee) {
      this.name.set(data.employee.name);
      this.skillIds.set(data.employee.skillIds);
    }
  }

  save() {
    const employee = {
      id: this.data?.employee?.id ?? Date.now(),
      name: this.name(),
      skillIds: this.skillIds()
    };

    this.dialogRef.close(employee);
  }

  getSkillName(skillId: number): string {
    return this.dataService.skills().find(s => s.id === skillId)?.name ?? 'Unknown';
  }
}
