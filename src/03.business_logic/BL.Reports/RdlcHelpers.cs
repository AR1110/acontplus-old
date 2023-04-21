using Domain.Dtos;
using Newtonsoft.Json;

namespace BL.Reports
{
    public static class RdlcHelpers
    {
        public static MemoryStream LoadReportDefinition(string filePath)
        {
            MemoryStream memoryStream = new MemoryStream();
            using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                fileStream.CopyTo(memoryStream);
            }
            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }
        public static ApiReportParamsDto ConverToModelReportParams(string data)
        {
            ApiReportParamsDto _response = new ApiReportParamsDto();
            Dictionary<string, string> rdlcParams = new Dictionary<string, string>();
            var _arrayProps = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(data);

            foreach (var item in _arrayProps.FirstOrDefault())
            {
                if (item.Key == "imagen" && !string.IsNullOrEmpty(item.Value))
                {
                    rdlcParams.Add(item.Key, item.Value);
                }
                if (item.Key == "mimeType" && !string.IsNullOrEmpty(item.Value))
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
