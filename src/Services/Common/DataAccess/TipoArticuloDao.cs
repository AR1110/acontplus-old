using System.Data;
using Common.Core.Models;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class TipoArticuloDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TipoArticuloDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();

        }
        public GenericResponse ReadTipoArticulo()
        {
            var listar = new List<TipoArticulo>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPTipoArticuloRead", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);

                                if (_gr.id == "1")
                                {
                                    var ta = new TipoArticulo();
                                    ta.idTipoArticulo = Convert.ToInt32(reader["idTipoArticulo"]);
                                    ta.descripcion = reader["descripcion"].ToString();
                                    ta.estado = Convert.ToBoolean(reader["estado"]);
                                    listar.Add(ta);
                                }
                            }
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Combo-Listar TipoArticulo";
            }
            return _gr;
        }
    }
}
