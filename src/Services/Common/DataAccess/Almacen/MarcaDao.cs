
using System.Data;
using Common.Core.Models;
using Domain.Models.Almacen;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Almacen
{
    public class MarcaDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public MarcaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _response = new GenericResponse();
        }

        //Operaciones Espciales
        public async Task<GenericResponse> OptionAsync(int idRol, int idMarca)
        {
            var listar = new List<Marca>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPMarcaOption", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idMarca", idMarca);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        _response.id = reader.GetString(0);
                        if (_response.id == "1")
                        {
                            var m = new Marca
                            {
                                idMarca = reader.GetInt32(1),
                                descripcion = reader.GetString(2)
                            };
                            listar.Add(m);
                        }
                    }
                }
                _response.data = listar;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
            }
            finally
            {

            }
            return _response;
        }
    }
}