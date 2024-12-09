import { roundNumber } from '@/shared/utils/round-number.util';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-payment-calculator',
    imports: [
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './payment-calculator.component.html',
    styleUrl: './payment-calculator.component.scss'
})
export class PaymentCalculatorComponent {

  appendValueMoney = output<number>();
  onClickNumber = output<number>()
  onClickPunto = output<string>()
  onClickClear = output();

  onEqual = output<string>()

  display: string = '0';

  appendMoney(value: string){
    if (['5', '10','15', '20'].includes(value)) {
      if (this.display === '0') {
        this.display = value;
      } else {
        // Sumar el valor al resultado actual
        this.display = (parseFloat(this.display) + parseFloat(value)).toString();

      }
      return;
    }
  }

  append(value: string) {


    // Si es "00", solo se permite después de un número
    if (value === '00') {
      const lastChar = this.display[this.display.length - 1];
      if (!['+', '-', '*', '/'].includes(lastChar)) {
        this.display += value;
      }
      return;
    }

    // Si la pantalla muestra "0" y no es un operador, reemplaza "0" con el valor
    if (this.display === '0' && value !== '.') {
      this.display = value;
    } else {
      // Previene la inserción de operadores consecutivos y controla el punto decimal
      const lastChar = this.display[this.display.length - 1];
      const isLastCharOperator = ['+', '-', '*', '/'].includes(lastChar);
      const isCurrentValueOperator = ['+', '-', '*', '/'].includes(value);
      const hasDecimalPoint = this.display.includes('.');

      if (
        !(isLastCharOperator && isCurrentValueOperator) &&
        !(value === '.' && hasDecimalPoint) &&
        !(value === '.' && isLastCharOperator)
      ) {
        this.display += value;
      }
    }

    if(this.display.startsWith('+')){
      this.display = '0'
    }
  }

  clear() {
    this.display = '0';
  }

  backspace() {
    this.display = this.display.slice(0, -1) || '0';
  }

  calculate() {
    // Verificar si hay un operador '+' sin un número seguido
    const trimmedDisplay = this.display.trim();
    if (/[\+\-\*\/]{2,}/.test(trimmedDisplay) || trimmedDisplay.endsWith('+')) {

      return;
    }

    // Verificar si hay un operador '+' al inicio sin número
    if (trimmedDisplay.startsWith('+')) {
      this.display = '0+';
      return;
    }

    try {
      // Evaluar la expresión matemática de manera segura
      const result = this.safeEval(trimmedDisplay);
      this.display = isNaN(result) ? 'Error' : roundNumber(result).toString();

      // Evita que se agregue un operador después del igual
      if (['+', '-', '*', '/'].includes(this.display[this.display.length - 1])) {
        this.display = this.display.slice(0, -1);
      }

      this.onEqual.emit(this.display)

    } catch {
      this.display = '0';
    }



  }


  private safeEval(expression: string): number {
    // Reemplazar operadores multiplicativos y divisores por sus símbolos equivalentes
    const sanitizedExpression = expression
      .replace(/x/g, '*')
      .replace(/÷/g, '/');

    // Evaluar la expresión usando la función `Function` (más segura que `eval`)
    try {
      const result = new Function('return ' + sanitizedExpression)();
      return result;
    } catch {
      return NaN;
    }
  }

  private roundNumber(value: number): number {
    return Math.round(value * 100) / 100;
  }

}
