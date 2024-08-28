import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-payment-calculator',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './payment-calculator.component.html',
  styleUrl: './payment-calculator.component.scss'
})
export class PaymentCalculatorComponent {

  appendValueMoney = output<number>();
  onClickNumber= output<number>()
  onClickPunto = output<string>()
  onClickClear = output();

}
