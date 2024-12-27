using Microsoft.Data.SqlClient;
using System.Data;
using Configuracion.API.Models;
using Common.AppSettings;

namespace Configuracion.API.Services;

public class TurnoService : ITurnoService
{
    private readonly IAdoRepository _repository;
    private readonly IConfiguration _configuration;
    private LegacyApiResponse _gr = new LegacyApiResponse();
    private readonly string _connectionStrings = string.Empty;

    public TurnoService(IAdoRepository respository, IConfiguration configuration)
    {
        _repository = respository;
        _configuration = configuration;
        _connectionStrings = _configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<string> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await _repository.GetDataTableAsync("Config.Turno_Get", parameters);
        if (!DataValidation.DataTableIsNull(dt))
        {
            return DataConverters.DataTableToJson(dt);
        }

        return null;
    }
    public async Task<LegacyApiResponse> CreateTurnoAsync(int idRol, Turno data)
    {
        using (var con = new SqlConnection(_connectionStrings))
        {
            using (var cmd = new SqlCommand("ASPTurnoCreate", con))
            {
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                ////Horario del turno
                var p = JsonConvert.SerializeObject(data.horario);
                cmd.Parameters.Add(new SqlParameter("json", p));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                    }
                }

            }
        }
        return _gr;
    }
    public async Task<LegacyApiResponse> UpdateTurnoAsync(int idRol, Turno data)
    {
        try
        {
            using (var con = new SqlConnection(_connectionStrings))
            {
                using (var cmd = new SqlCommand("ASPTurnoUpdate", con))
                {
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idTurno", data.idTurno);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    var p = JsonConvert.SerializeObject(data.horario);
                    cmd.Parameters.Add(new SqlParameter("json", p));
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                        }
                    }

                }
            }
        }
        catch (Exception ex)
        {
            _gr.id = "0";
            _gr.typeNotify = "warning";
            _gr.message = ex.Message.ToString();
            _gr.titleSms = "Actualizar Turno";
        }
        return _gr;

    }
    public async Task<LegacyApiResponse> ReadTurnoAsync(int idRol, int pageIndex, int pageSize)
    {
        var listar = new List<TurnoViewModel>();
        using (var con = new SqlConnection(_connectionStrings))
        {
            using (var cmd = new SqlCommand("ASPTurnoRead", con))
            {
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                cmd.Parameters.AddWithValue("pageSize", pageSize);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                        if (_gr.id == "1")
                        {
                            var item = new TurnoViewModel();
                            item.turno = new Turno()
                            {
                                idTurno = reader.GetInt32(4),
                                descripcion = reader.GetString(5),
                                estado = reader.GetBoolean(6)
                            };
                            item.totalRecords = reader.GetInt32(7);
                            listar.Add(item);
                        }
                    }
                }

            }
        }
        _gr.data = listar;
        return _gr;
    }
    public async Task<LegacyApiResponse> DeleteTurnoAsync(int idRol, int idTurno)
    {
        using (var con = new SqlConnection(_connectionStrings))
        {
            using (var cmd = new SqlCommand("ASPTurnoDelete", con))
            {
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idTurno", idTurno);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                    }
                }

            }
        }
        _gr.titleSms = "Eliminar Turno";
        return _gr;

    }
}
