using System.Data;
using Common.Core.Models;
using Common.Core.Models.GestionTributaria;
using Common.Core.ViewModels.GestionTributaria;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Common.Infrastructure.Repository.GestionTributaria
{
    public class ImpuestoArticuloDao
    {
        protected ApiResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ImpuestoArticuloDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new ApiResponse();
        }

        public ImpuestoArticuloDao()
        {
        }

        public async Task<ApiResponse> InsertAsync(int idRol, ImpuestoArticulo data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPImpuestoArticuloInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", data.idArticulo);
                    cmd.Parameters.AddWithValue("idSubContribuyente", data.idSubContribuyente);
                    cmd.Parameters.AddWithValue("idRetencionRenta", data.idRetencionRenta);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Impuesto de Articulo";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<ApiResponse> GetIdAsync(int idRol, int idArticulo)
        {
            var listar = new List<ImpuestoArticuloViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPImpuestoArticuloGetId", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", idArticulo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var ia = new ImpuestoArticuloViewModel()
                            {
                                impuestoArticulo = new ImpuestoArticulo()
                                {
                                    idImpuestoArticulo = reader.GetInt32(3),
                                    idSubContribuyente = reader.GetInt32(4),
                                    idRetencionRenta = reader.GetInt32(5)
                                },
                                subContribuyente = reader.GetString(6),
                                nombreRetencionRenta = reader.GetString(7),
                                idTipoImpuestoRenta = reader.GetInt32(8),
                                nombreTipoRenta = reader.GetString(9),
                                idTipoContribuyente = reader.GetInt32(10),
                                nombreTipoContribuyente = reader.GetString(11),

                            };
                            listar.Add(ia);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Impuesto de Articulo";
            }
            finally
            {


            }
            return _gr;
        }
        public async Task<ApiResponse> UpdateAsync(int idRol, int idImpuestoArticulo, ImpuestoArticulo data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPImpuestoArticuloUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idImpuestoArticulo", idImpuestoArticulo);
                    cmd.Parameters.AddWithValue("idArticulo", data.idArticulo);
                    cmd.Parameters.AddWithValue("idSubContribuyente", data.idSubContribuyente);
                    cmd.Parameters.AddWithValue("idRetencionRenta", data.idRetencionRenta);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Impuesto de Articulo";
            }
            finally
            {


            }
            return _gr;
        }
        public async Task<ApiResponse> DeleteAsync(int idRol, int idImpuestoArticulo)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPImpuestoArticuloDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idImpuestoArticulo", idImpuestoArticulo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar Impuesto de Articulo";
            }
            finally
            {

            }
            return _gr;
        }

        //Guardar Lista de Articulos Impuestos 
        public async Task<ApiResponse> ListaInsertAsync(int idRol, List<ImpuestoArticulo> data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPImpuestoArticuloListaInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    var lista = JsonConvert.SerializeObject(data);
                    cmd.Parameters.Add(new SqlParameter("json", lista));
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);

                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
                _gr.titleSms = "Error ";
            }
            return _gr;
        }
    }
}
