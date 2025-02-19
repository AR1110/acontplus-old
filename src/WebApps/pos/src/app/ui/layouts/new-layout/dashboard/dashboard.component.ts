import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MetricCardComponent } from '../metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [MatCardModule, MatProgressBarModule, MetricCardComponent],
})
export class DashboardComponent {
  metrics = [
    {
      icon: 'account_balance_wallet',
      title: 'Your bank balance',
      value: '$143,624',
    },
    {
      icon: 'pending_actions',
      title: 'Uncategorized transactions',
      value: '12',
    },
    { icon: 'group', title: 'Employees working today', value: '7' },
    {
      icon: 'credit_card',
      title: "This week's card spending",
      value: '$3,287.49',
    },
  ];

  todos = [
    { title: 'Run payroll', time: 'Mar 4 at 6:00 pm', icon: 'description' },
    {
      title: 'Review time off request',
      time: 'Mar 7 at 6:00 pm',
      icon: 'schedule',
    },
    {
      title: 'Sign board resolution',
      time: 'Mar 12 at 6:00 pm',
      icon: 'assignment',
    },
    {
      title: 'Finish onboarding Tony',
      time: 'Mar 12 at 6:00 pm',
      icon: 'person_add',
    },
  ];
}
