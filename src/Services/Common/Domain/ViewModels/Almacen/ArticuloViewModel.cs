using Domain.Models;
using Domain.Models.Almacen;
using Domain.ViewModels.Compras;

namespace Domain.ViewModels.Almacen
{
    public class ArticuloViewModel
    {
        public Articulo articulo { get; set; }
        public List<ArticuloPvPViewModel> pvp { get; set; }
        public string nombreSubFamilia { get; set; }
        public string nombreTipoArticulo { get; set; }
        public string nombreTipoIva { get; set; }
        public decimal porcentajeTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public int totalRecords { get; set; }
        public decimal stockBodega { get; set; }
        public string bodega { get; set; }
        public string ubicacion { get; set; }
        public decimal stockTotal { get; set; }
        public decimal precioVenta { get; set; }
        public decimal precioConIva { get; set; }
        public string tarifa { get; set; }
        public int idBodega { get; set; }
        public string nombreModelo { get; set; }
        public string nombreMarca { get; set; }
        public string nombreMedida { get; set; }
        public int cantidadRegistro { get; set; }
        public int numeroPagina { get; set; }
        public string codigoArticulo { get; set; }
        public decimal stock { get; set; }
        public string presentacion { get; set; }
        public int idPresentacion { get; set; }
        public string table { get; set; }
        public string precios { get; set; }
        public string codIce { get; set; }

    }

    public class ArticuloData
    {
        public ArticuloViewModel articulo { get; set; }
        public List<ArticuloPvPViewModel> pvps { get; set; }
        public List<ArticuloCodBaViewModel> codBarras { get; set; }
        public List<ArticuloUbViewModel> ubicaciones { get; set; }
    }

    public class ArticuloSearchViewModel
    {
        public List<ArticuloViewModel> filter { get; set; }
        public ArticuloViewModel codigo { get; set; }

    }

    public class ArticuloParams
    {
        public string jsonArticulo { get; set; }
        public string jsonpvp { get; set; }
        public int idBodega { get; set; }
        public string ubicacion { get; set; }
    }

    public class ArticuloMedidasFraccionado
    {
        public ArticuloViewModel articulo { get; set; }
        public List<MedidaViewModel> medidas { get; set; }
        public List<Etiqueta> etiqueta { get; set; }
        public List<ManejoArticuloViewModel> adicional { get; set; }
    }


}
