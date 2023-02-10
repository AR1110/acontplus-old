using ApiReports.Dao;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ApiReports.Utils;
using HelpersNS20.Dtos;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System.IO;
using HelpersNS20;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;

namespace ApiReports.Controllers
{
    public class ReporteController : ApiController
    {
        private readonly string _dirLogs = string.Empty;
        public ReporteController()
        {
            _dirLogs = System.Configuration.ConfigurationManager.AppSettings["dirLogs"];
        } 
        //Method for backend dynamic request
        [HttpPost]
        [Route("api/Reporte/GetReport")]
        public HttpResponseMessage GetReport(ApiReportParamsDto parameters)
        {
            FileModelDto _response = new FileModelDto();
            try
            {
                byte[] report = null;
                using (LocalReport lr = new LocalReport())
                {
                    string format = string.Empty;
                    string deviceInfo = string.Empty;
                    string fileName = string.Empty;
                    foreach (var item in parameters.rdlcProps)
                    {
                        if (item.Key == "rdlcName")
                        {
                            lr.ReportPath = Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/Reports"), item.Value);
                        }
                        if (item.Key == "format")
                        {
                            format = item.Value;
                        }
                        if (item.Key == "fileName")
                        {
                            fileName = item.Value;
                        }
                    }
                 
                    foreach (var item in parameters.dataSources)
                    {
                        lr.DataSources.Add(new ReportDataSource(item.Key, DataHelperNS.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                    }
                    if (parameters.rdlcParams != null)
                    {
                        int index = 0;
                        ReportParameter[] rp = new ReportParameter[parameters.rdlcParams.Keys.Count];
                        foreach (var item in parameters.rdlcParams)
                        {
                            rp[index++] = new ReportParameter(item.Key, item.Value);
                        }
                        lr.SetParameters(rp);
                    }
                    report = lr.Render(format,
                                       deviceInfo,
                                       PageCountMode.Actual,
                                       out string mimeType,
                                       out string encoding,
                                       out string fileNameExtension,
                                       out string[] streams,
                                       out Warning[] warnings);
                    //_response.message = "Report Created";

                    _response.ContentType = mimeType;
                    _response.FileName = fileName + "." + fileNameExtension;
                    _response.Content = report;

                    //Uncomment to preview report in postman
                    if (report == null || report.Length == 0)
                    {
                        ApiError.ReportNotFound(_response);
                    } 

                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                    //Set the Response Content.
                    response.Content = new ByteArrayContent(_response.Content);

                    //Set the Response Content Length.
                    response.Content.Headers.ContentLength = _response.Content.LongLength;

                    //Set the Content Disposition Header Value and FileName. 
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = _response.FileName;

                    //Set the File Content Type. 
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
                    return response;

                    //End Preview

                   
                    //return this.Request.CreateResponse(HttpStatusCode.OK, _response);
                }
            }
            catch (Exception ex)
            {
                Logs.LogWritter.LogError(_dirLogs, "Error in GetReport: " + ex.Message + " --> \n" + ex.StackTrace);
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, "Error al crear el reporte");
            }
        }
        //method for backend request to db
        [HttpPost]
        [Route("api/Reporte/Download")]
        public HttpResponseMessage Download(ApiReportParamsDto data)
        {
            FileModelDto _response = new FileModelDto();
            ReporteDao _r = new ReporteDao();
            string mimeType = string.Empty;
            string fileName = string.Empty;
            try
            {
                byte[] bytes = new GenerateReport().ByteReport(data, ref mimeType, ref fileName);
                if (bytes == null || bytes.Length == 0)
                {
                    ApiError.ReportNotFound(_response);
                }
                else
                {
                    _response.Create(bytes, mimeType, fileName);
                }
                return Request.CreateResponse(HttpStatusCode.OK, _response);
            }
            catch (Exception ex)
            {
                Logs.LogWritter.LogError(_dirLogs, "Error in Download: " + ex.Message + " --> \n" + ex.StackTrace);
                ApiError.ReportNotFound(_response);
            }
            return Request.CreateResponse(HttpStatusCode.OK, _response);
        }


        //Dynamic Report --> From Client
        [HttpPost]
        [Route("api/Reporte/DynamicReport")]
        public HttpResponseMessage DynamicReport(ApiReportParamsDto data)
        {
            FileModelDto _response = new FileModelDto();            
            string mimeType = string.Empty;
            string fileName = string.Empty;
            byte[] bytes = null;
            try
            {
                ApiReportParamsDto _dataReport = ConverToModelReportParams(data);
                bytes = new GenerateReport().ByteReportDynamic(_dataReport, ref mimeType, ref fileName);
                if (bytes == null || bytes.Length == 0)
                {
                    ApiError.ReportNotFound(_response);
                }
                else
                {
                    _response.Create(bytes, mimeType, fileName);
                }
                return Request.CreateResponse(HttpStatusCode.OK, _response);
            }
            catch (Exception ex)
            {
                Logs.LogWritter.LogError(_dirLogs, "Error in DynamicReport: " + ex.Message + " --> \n" + ex.StackTrace);
                ApiError.ReportNotFound(_response);
            }
            return Request.CreateResponse(HttpStatusCode.OK, _response);
        }

        public static ApiReportParamsDto ConverToModelReportParams(ApiReportParamsDto data)
        {
            ApiReportParamsDto _response = new ApiReportParamsDto();           
            Dictionary<string, string> rdlcParams = new Dictionary<string, string>();            
            var _arrayProps = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(data.reportParams);

            foreach (var item in _arrayProps.FirstOrDefault())
            {
                if (item.Key == "imagen" && !string.IsNullOrEmpty(item.Value))
                {                  
                    rdlcParams.Add(item.Key, item.Value);                     
                }
                if(item.Key=="mimeType" && !string.IsNullOrEmpty(item.Value))
                {
                    rdlcParams.Add(item.Key, item.Value);
                }

                if (item.Key == "claveAcceso" && !string.IsNullOrEmpty(item.Value))
                {
                    rdlcParams.Add(item.Key, item.Value);
                }

                if (item.Key == "rdlcParams" && !string.IsNullOrEmpty(item.Value.ToString()))
                {
                    var arrayParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value);                    
                    foreach (var paramRdlc in arrayParams.FirstOrDefault())
                    {
                        rdlcParams.Add(paramRdlc.Key, paramRdlc.Value);
                    }
                    
                }

                if (item.Key == "dataSources" && !string.IsNullOrEmpty(item.Value.ToString()))
                {
                    var arrayDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value.ToString());
                    Dictionary<string, List<Dictionary<string, string>>> ldDataSources = new Dictionary<string, List<Dictionary<string, string>>>();

                    foreach (var dataSource in arrayDS.FirstOrDefault())
                    {
                        var dataDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(dataSource.Value);
                        List<Dictionary<string, string>> dataSources = new List<Dictionary<string, string>>();

                        foreach (var value in dataDS)
                        {
                            Dictionary<string, string> itemDs = new Dictionary<string, string>();
                            foreach (var de in value)
                            {
                                itemDs.Add(de.Key, de.Value);
                            }
                            dataSources.Add(itemDs);
                        }
                        ldDataSources.Add(dataSource.Key, dataSources);
                    }
                    _response.dataSources = ldDataSources;
                }
            }

            _response.rdlcParams = rdlcParams;

            return _response;
        }

    }
}
