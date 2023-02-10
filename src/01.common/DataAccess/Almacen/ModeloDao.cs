
using Domain.Models;
using Domain.Models.Almacen;
using Domain.ViewModels.Almacen;
using Helpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace DataAccess.Almacen
{
    public class ModeloDao
    {
        protected GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ModeloDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> OptionAsync(int idRol)
        {
            var listar = new List<ModeloViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPModeloOption", con);

                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        if (_gr.id == "1")
                        {
                            var m = new ModeloViewModel
                            {
                                modelo = new Modelo()
                                {
                                    idModelo = reader.GetInt32(1),
                                    descripcion = reader.GetString(2),
                                    idMarca = reader.GetInt32(3),
                                },
                                nombreMarca = reader.GetString(4)
                            };
                            listar.Add(m);
                        }

                    }
                }
                _gr.data = listar;
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