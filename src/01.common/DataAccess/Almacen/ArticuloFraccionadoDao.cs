using Domain.Models.Almacen;
using Domain.ViewModels;
using Helpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Almacen
{
    public class ArticuloFraccionadoDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ArticuloFraccionadoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetIdAsync(int id)
        {
            var fraccionado = new ArticuloFraccionadoViewModel();
            var pvp = new List<ArticuloFraccionadoPvPViewModel>();
            var data = new ArticuloFraccionadoData();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Almacen.Fraccionado_Get_Id", con);
                    cmd.Parameters.AddWithValue("id", id);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            fraccionado.fraccionado = new ArticuloFraccionado()
                            {
                                idArticuloFraccionado = reader.GetInt32(3),
                                idArticulo = reader.GetInt32(4),
                                idMedida = reader.GetInt32(5),
                                conversion = reader.GetDecimal(6),
                                gestionVenta = reader.GetBoolean(7),
                                precioCostoFraccionado = reader.GetDecimal(8),
                            };
                            fraccionado.articulo = reader.GetString(9);
                            fraccionado.precioCosto = reader.GetDecimal(10);
                            fraccionado.codigo = reader.GetString(11);
                            fraccionado.nombreMedida = reader.GetString(12);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new ArticuloFraccionadoPvPViewModel()
                                {
                                    pvp = new ArticuloFraccionadoPvP()
                                    {
                                        idArticuloFraccionadoPvP = reader.GetInt32(0),
                                        idTarifa = reader.GetInt32(1),
                                        precioVenta = reader.GetDecimal(2),
                                        precioConIva = reader.GetDecimal(3),
                                        porcentajeUtilidad = reader.GetDecimal(4)
                                    },
                                    porcentajeIva = reader.GetDecimal(5),
                                    tarifa = reader.GetString(6),
                                };
                                pvp.Add(item);
                            }
                        }
                    }
                }
                data.fraccionado = fraccionado;
                data.pvps = pvp;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0"; ;
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId ArticuloFraccionado";
            }
            finally
            {
                
            }

            return _gr;
        }
    }
}
