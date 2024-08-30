import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { OrderService } from '@/services/order.service';
import { MainStoreService } from '@/store/main-store.service';


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
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private router = inject(Router)
  private orderSvc = inject(OrderService)
  private mainStoreSvc = inject(MainStoreService)

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    //labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    labels: [],

    datasets: [
      // {
      //   data: [40, 45, 50, 55, 60, 65, 70, 75, 70, 60, 50, 45],
      //   label: 'Ordenes',
      //   fill: true,
      //   tension: 0.5,
      //   borderColor: 'black',
      //   backgroundColor: 'rgba(255,0,0,0.3)'
      // },
      // {
      //   data: [45, 50, 60, 70, 75, 65, 50, 60, 55, 50, 45, 45],
      //   label: 'Nota Entrega',
      //   fill: true,
      //   tension: 0.5,
      //   borderColor: 'black',
      //   backgroundColor: 'rgba(0,255,0,0.3)'
      // },

    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };

  public lineChartLegend = true;


  //Productos mas vendidos
  private datos = [
    { id: 11, descripcion: 'TIGRILLO MIXTO COMPLETO', vecesVendido: 220 },
    { id: 9, descripcion: 'BOLON DE CHICHARRON COMPLETO', vecesVendido: 112 },
    { id: 26, descripcion: 'CAFE AMERICANO', vecesVendido: 110 },
    { id: 1, descripcion: 'LASAÑA DE POLLO CON PAN DE AJO Y ENSALADA CAPRIS', vecesVendido: 98 },
    { id: 65, descripcion: 'AGUA SIN GAS', vecesVendido: 89 }
  ];


  // Extraer descripciones y cantidades
  public barChartLabels = this.datos.map(item => item.descripcion);
  public barChartData: any =
    {
      data: this.datos.map(item => item.vecesVendido),
      label: 'Veces Vendido',
      backgroundColor: 'rgba(54, 162, 235, 0.5)', // Azul claro
      borderColor: 'rgba(54, 162, 235, 1)', // Azul oscuro
      borderWidth: 1
    }


  public barChartOptions: any = {
    responsive: true,
    indexAxis: 'y', // Barras horizontales
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Veces Vendido'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Descripción'
        }
      }
    }
  };

  public barChartLegend = true;
  public barChartPlugins = [];


  ngOnInit(): void {
    let { codEstab, establecimientoId } = this.mainStoreSvc.state();
    let params = {
      estabId: establecimientoId
    }
    this.orderSvc.getStats(params).subscribe(response => {
      console.log(response)

      // Extraer tipos de documentos únicos
      const tiposDocumentos = [...new Set(response.sales.map(item => item.docNom))];

      // Crear un objeto para almacenar los datos por tipo de documento y mes
      const datosPorTipoYMes = tiposDocumentos.reduce((acc, tipo) => {
        acc[tipo] = new Array(12).fill(0);
        return acc;
      }, {});

      // Actualizar datosPorTipoYMes con los datos proporcionados
      response.sales.forEach(item => {
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
        backgroundColor: colores[index] //.replace('0.2', '0.2') // Mantener la opacidad para el fondo
      }));

      // Configuración del gráfico
      const lineChartData = {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: datasets
      };

      this.lineChartData = lineChartData;


      //products mas vendidos
      this.barChartLabels = response.productsTop.map((item: any) => item.descripcion);
      this.barChartData.data = response.productsTop.map((item: any) => item.vecesVendido)


    })



  }

  navigateToPos() {
    console.log(this)
    this.router.navigate(['pos'])
  }

}
