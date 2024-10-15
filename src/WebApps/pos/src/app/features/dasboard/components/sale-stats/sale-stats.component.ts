import { Component, effect, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


const paletaColores = [
  'rgba(255, 99, 132, 0.5)',  // Rojo
  'rgba(54, 162, 235, 0.5)',  // Azul
  'rgba(255, 206, 86, 0.5)',  // Amarillo
  'rgba(75, 192, 192, 0.5)',  // Verde agua
  'rgba(153, 102, 255, 0.5)', // Púrpura
  'rgba(255, 159, 64, 0.5)'   // Naranja
];

function generarColorAleatorio() {
  const letras = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letras[Math.floor(Math.random() * 16)];
  }
  return color;
}


@Component({
  selector: 'app-sale-stats',
  standalone: true,
  imports: [
    MatCardModule,
    BaseChartDirective
  ],
  templateUrl: './sale-stats.component.html',
  styleUrl: './sale-stats.component.scss'
})
export class SaleStatsComponent {
  sales = input.required<any[]>()
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };

  public lineChartLegend = true;


  constructor() {
    effect(() => {


      // Extraer tipos de documentos únicos
      const tiposDocumentos = [...new Set(this.sales().map(item => item.docNom))];

      // Crear un objeto para almacenar los datos por tipo de documento y mes
      const datosPorTipoYMes = tiposDocumentos.reduce((acc, tipo) => {
        acc[tipo] = new Array(12).fill(0);
        return acc;
      }, {});

      // Actualizar datosPorTipoYMes con los datos proporcionados
      this.sales().forEach(item => {
        datosPorTipoYMes[item.docNom][item.mes - 1] = item.totalVendido;
      });

      // Generar colores dinámicos o usar paleta predefinida
      const colores = paletaColores.length >= tiposDocumentos.length
        ? paletaColores
        : Array.from({ length: tiposDocumentos.length }, () => generarColorAleatorio());

      // Configurar datasets para cada tipo de documento con colores dinámicos
      const datasets = tiposDocumentos.map((tipo, index) => ({
        data: datosPorTipoYMes[tipo],
        label: tipo,
        fill: true,
        tension: 0.5,
        borderColor: colores[index],
        backgroundColor: colores[index]
      }));

      // Configuración del gráfico
      const lineChartData = {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: datasets
      };

      this.lineChartData = lineChartData;
    })
  }

}
