using System.Data;
using System.Text;
using System.Text.Unicode;
using Lib.Common;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Lib.Common.Dtos;
using Microsoft.Reporting.NETCore;
using Restaurant.Core.Interfaces;
using Services.Lib.Common;

namespace Restaurant.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IADORepository _repository;
        public OrderService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Order_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }

        public async Task<string> AddAsync(ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                { "userRoleId", data.UserRoleId },
                { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data)) }
            };
            return await _repository.SPExecuteAsync("Restaurant.Order_Insert", parameters);
        }
        public async Task<string> PutAsync(int id, ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                { "userRoleId", data.UserRoleId },
                { "id", id },
                { "json", SqlStringParam.Sanitize(Converters.SerializeDictionary(data.Data)) }
            };
            return await _repository.SPExecuteAsync("Restaurant.Order_Update", parameters);
        }
        public async Task<string> PrintAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.Order_Print", parameters);
        }
        public async Task<ReportResponseDto> GetReportAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Order_Report", parameters);

            if (!ds.Tables.Contains("RdlcProps") | !ds.Tables.Contains("RdlcDataSources"))
            {
                return null;
            }

            if (ds.Tables["RdlcProps"].Rows.Count == 0 | ds.Tables["RdlcDataSources"].Rows.Count == 0)
            {
                return null;
            }

            using (LocalReport lr = new LocalReport())
            {
                var rdlcProps = DataTableMapper.BindData<RdlcPropsDto>(ds.Tables["RdlcProps"]);
                string path = Path.Combine(Directory.GetCurrentDirectory(), rdlcProps.ReportPath);
                lr.ReportPath = path;

                foreach (DataRow item in ds.Tables["RdlcDataSources"].Rows)
                {
                    lr.DataSources.Add(new ReportDataSource(item.Field<string>("dsName"), ds.Tables[item.Field<string>("dsName")]));
                }

                if (ds.Tables.Contains("RdlcParams") && ds.Tables["RdlcParams"].Rows.Count > 0)
                {
                    foreach (DataRow item in ds.Tables["RdlcParams"].Rows)
                    {
                        if (Convert.ToBoolean(item.Field<bool>("isBinary")))
                        {
                            lr.SetParameters(new[] { new ReportParameter(item.Field<string>("paramName"), FileExtensions.GetBase64FromByte(item.Field<byte[]>("paramValue"))) });
                        }
                        else
                        {
                            var paramValue = Encoding.UTF8.GetString(item.Field<byte[]>("paramValue"));
                            lr.SetParameters(new[] { new ReportParameter(item.Field<string>("paramName"), paramValue) });
                        }
                    }
                }
                byte[] fileReport = lr.Render(rdlcProps.ReportFormat, null, out _, out _, out _, out _, out _);
                return new ReportResponseDto { FileContents = fileReport, ContentType = rdlcProps.ContentType, FileDownloadName = rdlcProps.ReportName };
            }
        }
    }
}
