using Helpers;
using Domain.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess
{
    public class EntidadConfigSriDao : ConnectionDb
    {
        protected GenericResponse _gr;

        public EntidadConfigSriDao()
        {
            _gr = new GenericResponse();
        }
    }
}
