using System.Data;
using Common.Core.Models;
using Common.Core.Models.Almacen;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Almacen
{
    public class MedidaDao
    {
        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public MedidaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> GetByMedida(int idRol)
        {
            var list = new List<Medida>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPMedidaGetBy", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        if (_gr.id == "1")
                        {
                            var m = new Medida
                            {
                                idMedida = reader.GetInt32(2),
                                descripcion = reader.GetString(3)
                            };
                            list.Add(m);
                        }
                    }
                }
                _gr.data = list;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {


            }
            return _gr;
        }
    }
}