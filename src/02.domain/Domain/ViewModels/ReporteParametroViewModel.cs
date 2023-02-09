using Domain.Dtos;
using Domain.Models;
using System.Collections.Generic;

namespace Domain.ViewModels
{
    public class ReporteParametroViewModel
    {
        public ReporteParametro report { get; set; }
        public List<ReporteParametroDataSource> dataSources { get; set; }
        public List<ReporteParametroRdlcDto> reportParams { get; set; }
    }
}