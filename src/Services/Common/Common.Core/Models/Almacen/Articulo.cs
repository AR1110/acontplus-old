namespace Common.Core.Models.Almacen
{
    public class Articulo
    {
        public int idArticulo { get; set; }
        public int idSubFamilia { get; set; }
        public int idTipoIce { get; set; }
        public int idTipoArticulo { get; set; }
        public int idModelo { get; set; }
        public int idMarca { get; set; }
        public int idTipoIva { get; set; }
        public int idMedida { get; set; }
        public int idActividad { get; set; }
        public string codigo { get; set; }
        public string codigoAuxiliar { get; set; }
        public string descripcion { get; set; }
        public decimal valorIce { get; set; }
        public bool llevaInventario { get; set; }
        public bool datosAdicionales { get; set; }
        public bool datosLote { get; set; }
        public string lote { get; set; }
        public string fechaCreacion { get; set; }
        public string fechaCaducidadLote { get; set; }
        public bool productoFraccionable { get; set; }
        public int stockMinimo { get; set; }
        public int stockMaximo { get; set; }
        public string observaciones { get; set; }
        public bool caducidad { get; set; }
        public string fechaCaducidad { get; set; }
        public bool estado { get; set; }
        public decimal precioCosto { get; set; }
        public string codigoBarra { get; set; }
        public string articulo { get; set; }
        public decimal stock { get; set; }
        public bool imagen { get; set; }
    }



}