import { EmployeeDialogComponent } from '../../components/employee-detail-dialog/employee-detail-dialog';
import { MatchDetailDialogComponent } from '../../components/match-detail-dialog/match-detail-dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, computed, signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { calculateMatch } from '../../utils/matcher.utils';
import { DataService } from '../../services/data.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-matcher',
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatSelectModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,  
    MatListModule,
    MatChipsModule,
  ],
  templateUrl: './matcher.html',
  styleUrl: './matcher.scss',
})
export class Matcher {

  selectedEmployeeSkills = signal<number[]>([]);
  selectedJobSkills = signal<number[]>([]);
  
  selectedJobId = signal<number | null>(null);

  selectedJob = computed(() =>
    this.data.jobs().find(j => j.id === this.selectedJobId())
  );

  matches = computed(() => {
    const job = this.selectedJob();
    if (!job) return [];

    return this.data.employees()
      .map(e => ({
        employee: e,
        percentage: calculateMatch(job.skillIds, e.skillIds)
      }))
      .filter(m => m.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage);
  });

  openMatchDetail(match: any) {
    this.dialog.open(MatchDetailDialogComponent, {
      width: '520px',
      data: {
        job: this.selectedJob(),
        employee: match.employee,
        percentage: match.percentage
      }
    });
  }

  getSkillName(skillId: number): string {
    return this.data.skills().find(s => s.id === skillId)?.name ?? 'Unknown';
  }

  getMatchLabel(percentage: number): string {
    if (percentage >= 75) return 'High match';
    if (percentage >= 50) return 'Medium match';
    return 'Low match';
  }

  getMatchClass(percentage: number): string {
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  }

  filteredEmployees = computed(() => {
    const skills = this.selectedEmployeeSkills();
    if (!skills.length) return this.data.employees();

    return this.data.employees().filter(emp =>
      skills.every(skillId => emp.skillIds.includes(skillId))
    );
  });

  filteredJobs = computed(() => {
    const skills = this.selectedJobSkills();
    if (!skills.length) return this.data.jobs();

    return this.data.jobs().filter(job =>
      skills.every(skillId => job.skillIds.includes(skillId))
    );
  });

  openEmployee(employee?: any) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '520px',
      data: { employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (employee) {
        this.data.updateEmployee(result);
      } else {
        this.data.addEmployee(result);
      }
    });
  }

  constructor(public data: DataService,
    private dialog: MatDialog
  ) {}
}
