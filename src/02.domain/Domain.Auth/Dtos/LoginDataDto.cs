namespace Domain.Auth.Dtos
{
    public class LoginDataDto
    {
        public int idUsuarioRol { get; set; }
        public string userName { get; set; }
        public string fullName { get; set; }
        public string role { get; set; }
        public string nroIdentificacion { get; set; }
        public string image { get; set; }
        public string rucEmpresa { get; set; }
        public string razonSocial { get; set; }
        public string urlGateway { get; set; }
    }
}
