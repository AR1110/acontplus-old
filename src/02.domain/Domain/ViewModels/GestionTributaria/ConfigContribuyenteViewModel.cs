using Domain.Models.GestionTributaria;
using System.Collections.Generic;

namespace Domain.ViewModels.GestionTributaria
{
    public class ConfigContribuyenteViewModel
    {
        public ConfiguracionContribuyente config { get; set; }
        public List<ConfiguracionContribuyenteDetalle> detalle { get; set; }
        public string subContribuyenteEmpresa { get; set; }
        public string subContribuyenteProveedor { get; set; }
        public string tipoContribuyenteEmpresa { get; set; }
        public string tipoContribuyenteProveedor { get; set; }
    }

    public class ConfigContribuyenteData
    {
        public ConfigContribuyenteViewModel config { get; set; }
        public List<ConfigContribuyenteDetalleViewModel> detalle { get; set; }
    }
}
