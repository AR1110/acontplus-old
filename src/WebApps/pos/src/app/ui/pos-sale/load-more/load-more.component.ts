import { Component, EventEmitter, Input, output, Output } from '@angular/core';
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
  loadMore = output();

  onLoadMore() {
    if (!this.loading && !this.noMoreItems) {
      console.log('Load more items');
      this.loadMore.emit();
    }
  }
}
