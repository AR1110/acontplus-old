namespace Compras.API.Helpers;

public class DataComprobante
{
    public string CodDoc { get; set; }
    public string ClaveAcceso { get; set; }
    public string FechaEmision { get; set; }
    public string VersionComp { get; set; }
    public XmlDocument XmlTosave { get; set; }

    public async Task Get(IFormFile file)
    {
        var xmlDocSri = new XDocument();

        using (var str = new MemoryStream())
        {
            await file.CopyToAsync(str);
            str.Position = 0;
            xmlDocSri = XDocument.Load(str);
        }

        var docNew = new XmlDocument();

        using (var xmlReader = xmlDocSri.CreateReader())
        {
            docNew.Load(xmlReader);
        }

        var nodeAuth = docNew.GetElementsByTagName("autorizacion")[0];
        var nodeComp = nodeAuth?.SelectSingleNode("comprobante");
        if (nodeComp != null)
        {
            var xmlComp = new XmlDocument();
            xmlComp.LoadXml(nodeComp.InnerText);

            var declarationsI = xmlComp.ChildNodes.OfType<XmlNode>()
                .Where(x => x.NodeType == XmlNodeType.XmlDeclaration)
                .ToList();
            declarationsI.ForEach(x => xmlComp.RemoveChild(x));


            var node = xmlComp.GetElementsByTagName("infoTributaria")[0];

            ClaveAcceso = node?.SelectSingleNode("claveAcceso")?.InnerText;
            CodDoc = node?.SelectSingleNode("codDoc")?.InnerText;
            switch (CodDoc)
            {
                case "01":
                    VersionComp = xmlComp.GetElementsByTagName("factura")[0].Attributes["version"].Value;
                    FechaEmision = xmlComp.GetElementsByTagName("infoFactura")[0].SelectSingleNode("fechaEmision")
                        .InnerText;
                    break;
                case "03":
                    VersionComp = xmlComp.GetElementsByTagName("liquidacionCompra")[0].Attributes["version"].Value;
                    FechaEmision = xmlComp.GetElementsByTagName("infoLiquidacionCompra")[0]
                        .SelectSingleNode("fechaEmision").InnerText;
                    break;
                case "04":
                    VersionComp = xmlComp.GetElementsByTagName("notaCredito")[0].Attributes["version"].Value;
                    FechaEmision = xmlComp.GetElementsByTagName("infoNotaCredito")[0]
                        .SelectSingleNode("fechaEmision").InnerText;
                    break;
                case "05":
                    VersionComp = xmlComp.GetElementsByTagName("notaDebito")[0].Attributes["version"].Value;
                    FechaEmision = xmlComp.GetElementsByTagName("infoNotaDebito")[0]
                        .SelectSingleNode("fechaEmision").InnerText;
                    break;
                case "06":
                    VersionComp = xmlComp.GetElementsByTagName("guiaRemision")[0].Attributes["version"].Value;
                    FechaEmision = xmlComp.GetElementsByTagName("infoGuiaRemision")[0]
                        .SelectSingleNode("fechaEmision").InnerText;
                    break;
                case "07":
                    VersionComp = xmlComp.GetElementsByTagName("comprobanteRetencion")[0].Attributes["version"]
                        .Value;
                    FechaEmision = xmlComp.GetElementsByTagName("infoCompRetencion")[0]
                        .SelectSingleNode("fechaEmision").InnerText;
                    break;
            }
            XmlTosave = new XmlDocument();
            XmlTosave.LoadXml(nodeAuth.OuterXml);


            var declarations = XmlTosave.ChildNodes.OfType<XmlNode>()
                .Where(x => x.NodeType == XmlNodeType.XmlDeclaration)
                .ToList();

            declarations.ForEach(x => XmlTosave.RemoveChild(x));

            var root = XmlTosave.GetElementsByTagName("autorizacion")[0];

            root.SelectSingleNode("comprobante").InnerText = xmlComp.OuterXml;
        }
    }
}
