
using System.Data;
using Common.Core.Models;
using Domain.Models.Almacen;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Almacen
{
    public class ArticuloCodigoBarraDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ArticuloCodigoBarraDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetIdAsync(int id)
        {
            var listar = new List<ArticuloCodigoBarraOperaciones>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("Almacen.CodigoBarra_Get_Id", con);
                    cmd.Parameters.AddWithValue("id", id);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            _response.id = reader.GetString(0);
                            _response.typeNotify = reader.GetString(1);
                            _response.message = reader.GetString(2);
                            _response.titleSms = reader.GetString(3);
                            if (_response.id == "1")
                            {
                                var _cb = new ArticuloCodigoBarraOperaciones
                                {
                                    articuloCodigoBarra = new ArticuloCodigoBarra()
                                    {
                                        idArticuloCodigoBarra = reader.GetInt32(4),
                                        codigoBarra = reader.GetString(5),
                                        descripcion = reader.GetString(6),
                                        color = reader.GetString(7),
                                        estado = reader.GetBoolean(8),
                                        codigoPrincipal = reader.GetBoolean(9)
                                    },
                                    medida = new Medida()
                                    {
                                        idMedida = reader.GetInt32(10),
                                        descripcion = reader.GetString(11)
                                    }
                                };
                                listar.Add(_cb);
                            }
                        }
                    }

                    _response.data = listar;
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.typeNotify = "warning";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Listar Codigo de Barra";
            }
            return _response;
        }
    }
}