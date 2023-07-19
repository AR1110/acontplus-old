namespace Domain.Models
{
    public class Cliente
    {
        public int idCliente { get; set; }
        public int idTipoClienteProveedor { get; set; }
        public int idEmpleado { get; set; }
        public int idTipoEntidad { get; set; }
        public int idSubContribuyente { get; set; }
        public int idTiempoCredito { get; set; }
        public int idTipoIdentificacion { get; set; }
        public int idCiudad { get; set; }
        public int idEmpresa { get; set; }
        public int idCargo { get; set; }
        public string placa { get; set; }
        public string numeroIdentificacion { get; set; }
        public string nombreFiscal { get; set; }
        public decimal montoCredito { get; set; }
        public string nombreComercial { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string correo { get; set; }
        public bool estado { get; set; }
        public bool consumidorFinal { get; set; }
        public string nota { get; set; }
        public bool validationSri { get; set; }

    }
}
