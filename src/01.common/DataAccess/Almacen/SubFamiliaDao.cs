using Helpers;
using Domain.Models;
using Domain.Models.Almacen;
using Domain.ViewModels.Almacen;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Almacen
{
    public class SubFamiliaDao
    {
        protected GenericResponse _response;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public SubFamiliaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _response = new GenericResponse();
        }
        //Operaciones Especiales
        public async Task<GenericResponse> OptionAsync(int idRol)
        {
            var listar = new List<SubFamiliaViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspSubFamiliaOption", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        if (_response.id == "1")
                        {
                            var sf = new SubFamiliaViewModel
                            {
                                subFamilia = new SubFamilia()
                                {
                                    idSubFamilia = reader.GetInt32(1),
                                    idFamilia = reader.GetInt32(2),
                                    descripcion = reader.GetString(3),

                                },
                                codigoArticulo = reader.GetString(4),
                                nombreFamilia = reader.GetString(5),
                            };
                            listar.Add(sf);
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