namespace Inventory.Application.Dtos;

public record JsonArticuloDto
{
    public int IdSubFamilia { get; set; }
    public int IdMarca { get; set; }
    public int IdModelo { get; set; }
    public int IdTipoIce { get; set; }
    public int IdTipoArticulo { get; set; }
    public int IdTipoIva { get; set; }
    public int IdMedida { get; set; }
    public decimal PrecioCosto { get; set; }
    public decimal PrecioSinSubsidio { get; set; }
    public string? Codigo { get; set; }
    public string? CodigoAuxiliar { get; set; }
    public decimal ValorIce { get; set; }
    public string? Descripcion { get; set; }
    public bool LlevaInventario { get; set; }
    public bool DatosAdicionales { get; set; }
    public bool ProductoFraccionable { get; set; }
    public bool DatosLote { get; set; }
    public string? Lote { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaCaducidadLote { get; set; }
    public int StockMinimo { get; set; }
    public int StockMaximo { get; set; }
    public string? Observaciones { get; set; }
    public bool Caducidad { get; set; }
    public DateTime? FechaCaducidad { get; set; }
    public string? CodigoBarra { get; set; }
    public int IdEtiqueta { get; set; }
    public bool Estado { get; set; }
    public int CantMinimaVentaPorMayor { get; set; }
}


public record JsonPvpDto
{
    public int IdArticuloPvP { get; set; }
    public int IdTarifa { get; set; }
    public decimal PrecioVenta { get; set; }
    public decimal PrecioConIva { get; set; }
    public decimal PorcentajeUtilidad { get; set; }
    public bool PrecioPredeterminado { get; set; }
};

public record CreateArticuloDto
{
    public List<JsonArticuloDto>? detalles { get; set; }
    public List<JsonPvpDto>? pvps { get; set; }
    public int IdBodega { get; set; }
    public string? Ubicacion { get; set; }
}

public record UpdateArticuloDto
{
    public List<JsonArticuloDto>? detalles { get; set; }
    public List<JsonPvpDto>? pvps { get; set; }
    public int IdBodega { get; set; }
    public string? Ubicacion { get; set; }
}

