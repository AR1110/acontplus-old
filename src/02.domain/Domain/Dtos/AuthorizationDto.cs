using System;

namespace Domain.Dtos
{
    public class AuthorizationDto
    {
        public string ambiente { get; set; }
        public String xml { get; set; }
        public string urlRecepcion { get; set; }
        public string urlAutorizacion { get; set; }
        public string signatureName { get; set; } //NOMBRE DEL ARCHIVO DE LA FIRMA ELECTRONICA
        public string signaturePassword { get; set; } //CONTRASEÑA DEL ARCHIVO DE LA FIRMA ELECTRONICA
    }
}
