using Newtonsoft.Json;

namespace Domain.Config.Dtos
{
    public class ApiPrintRequestDto
    {
        public List<Dictionary<string, string>> rdlcProps { get; set; }
        public Dictionary<string, List<Dictionary<string, string>>> dataSources { get; set; }
        public Dictionary<string, string> rdlcParams { get; set; }

        public void Create(Dictionary<string, string> parameters)
        {
            Dictionary<string, string> rdlcProps = new Dictionary<string, string>();

            Dictionary<string, string> rdlcParams = new Dictionary<string, string>();

            Dictionary<string, List<Dictionary<string, string>>> ldDataSources = new Dictionary<string, List<Dictionary<string, string>>>();

            foreach (var item in parameters)
            {
                if (item.Key == "rdlcProps")
                {
                    var dataDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value);
                    List<Dictionary<string, string>> rdlcPropssss = new List<Dictionary<string, string>>();

                    foreach (var valueII in dataDS)
                    {
                        Dictionary<string, string> itemDs = new Dictionary<string, string>();
                        foreach (var de in valueII)
                        {
                            itemDs.Add(de.Key, de.Value);
                        }
                        rdlcPropssss.Add(itemDs);
                    }
                    this.rdlcProps = rdlcPropssss;
                }
                if (item.Key == "dataSources")
                {
                    var arrayDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value.ToString());

                    foreach (var dataSource in arrayDS.FirstOrDefault())
                    {
                        var dataDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(dataSource.Value);
                        List<Dictionary<string, string>> dataSources = new List<Dictionary<string, string>>();

                        foreach (var valueII in dataDS)
                        {
                            Dictionary<string, string> itemDs = new Dictionary<string, string>();
                            foreach (var de in valueII)
                            {
                                itemDs.Add(de.Key, de.Value);
                            }
                            dataSources.Add(itemDs);
                        }
                        ldDataSources.Add(dataSource.Key, dataSources);
                    }
                    this.dataSources = ldDataSources;
                }
                if (item.Key == "rdlcParams" && item.Value != "undefined")
                {
                    var _arrayParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value);
                    foreach (var paramRdlc in _arrayParams.FirstOrDefault())
                    {
                        rdlcParams.Add(paramRdlc.Key, paramRdlc.Value);
                    }
                    this.rdlcParams = rdlcParams;
                }
            }
        }
    }
}