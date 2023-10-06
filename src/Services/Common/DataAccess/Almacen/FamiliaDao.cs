
using System.Data;
using System.Data.SqlClient;
using Domain.Models.Almacen;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Almacen
{
    public class FamiliaDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public FamiliaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _response = new GenericResponse();
        }
        //Operaciones Especiales 
        public async Task<GenericResponse> OptionAsync(int idRol)
        {
            var listar = new List<Familia>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspFamiliaOption", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _response.id = reader.GetString(0);
                        if (_response.id == "1")
                        {
                            var f = new Familia
                            {
                                idFamilia = reader.GetInt32(1),
                                descripcion = reader.GetString(2)
                            };
                            listar.Add(f);
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