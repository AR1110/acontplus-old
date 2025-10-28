import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-sidebar-notice',
  templateUrl: './sidebar-notice.html',
  styleUrl: './sidebar-notice.scss',
  host: {
    class: 'acontplus-sidebar-notice',
  },
  encapsulation: ViewEncapsulation.None,
  imports: [MatTabsModule],
})
export class SidebarNotice {
  tabs = [
    {
      label: 'Today',
      messages: [
        {
          icon: '🔔',
          color: 'bg-red-95',
          title: 'General Meeting for update',
          content: `You can use the Dashboard to explore how many new users download reports daily and monthly.`,
        },
        {
          icon: '📢',
          color: 'bg-azure-95',
          title: 'Widgets update',
          content: `We've made some updates to the emendable widget which we think you are going to love.`,
        },
        {
          icon: '⏳',
          color: 'bg-violet-95',
          title: 'Coming soon new features',
          content: `More new features are coming soon, so stay patient!`,
        },
      ],
    },
    {
      label: 'Notifications',
      messages: [
        {
          icon: '📩',
          color: 'bg-magenta-95',
          title: 'Weekly reports are available',
          content: `Please go to the notification center to check your reports.`,
        },
      ],
    },
  ];
}
