import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, computed, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { calculateMatch } from '../../utils/matcher.utils';
import { DataService } from '../../services/data.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatchDetailDialogComponent } from '../../components/match-detail-dialog/match-detail-dialog';

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

  constructor(public data: DataService,
    private dialog: MatDialog
  ) {}
}
