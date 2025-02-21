import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-load-more',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './load-more.component.html',
  styleUrl: './load-more.component.scss',
})
export class LoadMoreComponent {
  @Input() loading = false;
  @Input() noMoreItems = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() loadMore = new EventEmitter<void>();

  onLoadMore() {
    if (!this.loading && !this.noMoreItems) {
      this.loadMore.emit();
    }
  }

  // Add ripple effect on click
  addRippleEffect(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 3000);
  }
}
