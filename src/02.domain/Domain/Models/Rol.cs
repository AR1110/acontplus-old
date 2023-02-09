using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models
{
    public class Rol
    {
        public int idRol { get; set; }

        public int idPolitica { get; set; }
        public int idUsuario { get; set; }
        public int idEntidad { get; set; }
        public int idSucursal { get; set; }
        public bool sucurDefecto { get; set; }
        public bool estado { get; set; }



    }
    public class RolOperaciones
    {
        public Rol rol { get; set; }
        public List<Rol> roles { get; set; }
        //public Usuario usuario { get; set; }
        //public List<Usuario> usuarios { get; set; }
        public Politica politica { get; set; }
        public List<Politica> politicas { get; set; }
        public Entidad entidad { get; set; }
        public Sucursal sucursal { get; set; }
        public List<Menu> menus { get; set; }
    }
}