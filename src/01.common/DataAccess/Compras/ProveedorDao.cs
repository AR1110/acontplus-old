
using Helpers;
using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Compras
{
    public class ProveedorDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ProveedorDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _response = new GenericResponse();
        }
        //Gestion de informacion CRUD. 
        public async Task<GenericResponse> GetIdAsync(int idRol, int idProveedor)
        {
            var item = new ProveedorViewModel();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPProveedorGetId", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProveedor", idProveedor);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _response.id = reader.GetString(0);
                            _response.message = reader.GetString(1);
                            _response.titleSms = reader.GetString(2);
                            if (_response.id == "1")
                            {

                                item.proveedor = new Proveedor()
                                {
                                    idProveedor = reader.GetInt32(3),
                                    idTipoClienteProveedor = reader.GetInt32(4),
                                    idTipoEntidad = reader.GetInt32(5),
                                    idSubContribuyente = reader.GetInt32(6),
                                    idTiempoCredito = reader.GetInt32(7),
                                    idTipoIdentificacion = reader.GetInt32(8),
                                    idCiudad = reader.GetInt32(9),
                                    numeroIdentificacion = reader.GetString(10),
                                    nombreFiscal = reader.GetString(11),
                                    nombreComercial = reader.GetString(12),
                                    direccion = reader.GetString(13),
                                    telefono = reader.GetString(14),
                                    correo = reader.GetString(15),
                                    estado = reader.GetBoolean(16),
                                };
                                item.tipoIdentificacion = reader.GetString(17);
                                item.diasCredito = reader.GetInt32(18);
                                item.codigoIndetificacion = reader.GetString(19);
                            }
                        }
                    }
                }
                _response.data = item;

            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Buscar Proveedor";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> SearchProveedorAsync(int idRol, string busqueda)
        {
            var listar = new List<ProveedorViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPProveedorSearch", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("busqueda", busqueda ?? "");
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _response.id = reader.GetString(0);
                                _response.message = reader.GetString(1);
                                _response.titleSms = reader.GetString(2);
                                if (_response.id == "1")
                                {
                                    var item = new ProveedorViewModel();
                                    item.proveedor = new Proveedor()
                                    {
                                        idProveedor = reader.GetInt32(3),
                                        idTiempoCredito = reader.GetInt32(4),
                                        numeroIdentificacion = reader.GetString(5),
                                        nombreFiscal = reader.GetString(6),
                                        nombreComercial = reader.GetString(7),
                                        direccion = reader.GetString(8),
                                        telefono = reader.GetString(9),
                                        correo = reader.GetString(10),
                                    };
                                    item.diasCredito = reader.GetInt32(11);
                                    item.codigoIndetificacion = reader.GetString(12);
                                    listar.Add(item);
                                }
                            }
                        }
                    }
                    _response.data = listar;
                }

            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Buscar Proveedor";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, Proveedor data)
        {
            var item = new ProveedorViewModel();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPProveedorPost", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idTipoIdentificacion", data.idTipoIdentificacion);
                    cmd.Parameters.AddWithValue("numeroIdentificacion", data.numeroIdentificacion);
                    cmd.Parameters.AddWithValue("nombreFiscal", data.nombreFiscal);
                    cmd.Parameters.AddWithValue("nombreComercial", data.nombreComercial);
                    cmd.Parameters.AddWithValue("direccion", data.direccion ?? "");
                    cmd.Parameters.AddWithValue("telefono", data.telefono ?? "");
                    cmd.Parameters.AddWithValue("correo", data.correo ?? "");
                    cmd.Parameters.AddWithValue("idTipoClienteProveedor", data.idTipoClienteProveedor);
                    cmd.Parameters.AddWithValue("idTipoEntidad", data.idTipoEntidad);
                    cmd.Parameters.AddWithValue("idCiudad", data.idCiudad);
                    cmd.Parameters.AddWithValue("idSubContribuyente", data.idSubContribuyente);
                    cmd.Parameters.AddWithValue("idTiempoCredito", data.idTiempoCredito);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);

                        if (_response.id == "1")
                        {
                            _response.data = reader.GetInt32(3);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Registrar Provedor";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idProveedor, Proveedor data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPProveedorUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProveedor", idProveedor);
                    cmd.Parameters.AddWithValue("nombreFiscal", data.nombreFiscal);
                    cmd.Parameters.AddWithValue("nombreComercial", data.nombreComercial);
                    cmd.Parameters.AddWithValue("direccion", data.direccion ?? "");
                    cmd.Parameters.AddWithValue("telefono", data.telefono ?? "");
                    cmd.Parameters.AddWithValue("correo", data.correo ?? "");
                    cmd.Parameters.AddWithValue("idTipoClienteProveedor", data.idTipoClienteProveedor);
                    cmd.Parameters.AddWithValue("idTipoEntidad", data.idTipoEntidad);
                    cmd.Parameters.AddWithValue("idCiudad", data.idCiudad);
                    cmd.Parameters.AddWithValue("idSubContribuyente", data.idSubContribuyente);
                    cmd.Parameters.AddWithValue("idTiempoCredito", data.idTiempoCredito);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _response.id = reader.GetString(0);
                        _response.typeNotify = reader.GetString(1);
                        _response.message = reader.GetString(2);
                        _response.titleSms = reader.GetString(3);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.typeNotify = "warning";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Actualizar Proveedor";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idProveedor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPProveedorDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProveedor", idProveedor);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _response.id = reader.GetString(0);
                        _response.typeNotify = reader.GetString(1);
                        _response.message = reader.GetString(2);
                        _response.titleSms = reader.GetString(3);
                    }

                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.typeNotify = "warning";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Eliminar Proveedor";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> GetIdAsycn(int id)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Compra.Proveedor_Get_Id");
                db.AddParameter("id", SqlDbType.Int, id);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDataTable(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> SearchAsync(int idRol, string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Compra.Proveedor_Get_Search");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("json", SqlDbType.NVarChar, json);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDataTable(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
    }
}
