using es.mityc.firmaJava.libreria.xades;
using es.mityc.javasign.pkstore;
using es.mityc.javasign.pkstore.keystore;
using es.mityc.javasign.xml.refs;
using java.io;
using java.security;
using java.security.cert;
using java.util;
using javax.xml.parsers;
using Logs;
using org.apache.xml.security.utils;
using org.w3c.dom;
using System;

namespace SignerWS
{
    public class SignDocument
    {
        private readonly string dirLogs = string.Empty;
        private readonly string dirCertificates = string.Empty;
        public SignDocument()
        {
            dirLogs = System.Configuration.ConfigurationManager.AppSettings["dirLogs"];
            dirCertificates = System.Configuration.ConfigurationManager.AppSettings["dirCertificates"];
        }


        private X509Certificate _LoadCertificate(string archivoP12Path, string claveArvhivoP12, out PrivateKey privateKey, out Provider provider)
        {
            X509Certificate x509Certificate = (X509Certificate)null;
            provider = (Provider)null;
            privateKey = (PrivateKey)null;
            KeyStore instance = KeyStore.getInstance("PKCS12");
            java.io.InputStream stream = (java.io.InputStream)new FileInputStream(archivoP12Path);
            instance.load(stream, claveArvhivoP12.ToCharArray());
            IPKStoreManager pkStoreManager = (IPKStoreManager)new KSStore(instance, (IPassStoreKS)new PassStoreKS(claveArvhivoP12));
            List signCertificates = pkStoreManager.getSignCertificates();
            if (signCertificates.size() > 0)
            {
                X509Certificate xc = (X509Certificate)signCertificates.get(0);
                privateKey = pkStoreManager.getPrivateKey(xc);
                provider = pkStoreManager.getProvider(xc);
                return xc;
            }
            stream.close();
            return x509Certificate;
        }

        //CONVIERTE DE string A org.w3c.dom.Document (XML)
        private Document LoadXmlFromString(string xml)
        {
            try
            {
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                factory.setNamespaceAware(true);
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document documento = builder.parse(new ByteArrayInputStream(System.Text.Encoding.UTF8.GetBytes(xml)));
                return documento;
            }
            catch (Exception ex)
            {
                LogWritter.LogError(dirLogs, "Error al leyendo el xml: " + ex.Message);
                return null;
            }
        }

        //CONVIERTE DE org.w3c.dom.Document A string (XML)
        private byte[] GetBytesFromDocument(Document doc)
        {
            try
            {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                XMLUtils.outputDOM(doc, baos, true);
                return baos.toByteArray();
            }
            catch (Exception ex)
            {
                LogWritter.LogError(dirLogs, "Error al obteniendo la firma el comprobante: " + ex.Message);
                return null;
            }
        }

        public bool Sign(string xmlUnsigned, string filePath, string password, ref string xmlSigned)
        {
            bool signed = true;
            PrivateKey privateKey;
            Provider provider;
            //LogWritter.LogInfo(dirLogs, "0", "DATA SIGN: " +  filePath + " - " + password);

            //OBTENER CERTIFICADO
            X509Certificate certificadoFirma = this._LoadCertificate(filePath, password, out privateKey, out provider);

            //VERIFICA EXISTENCIA DE CERTIFICADO
            if (certificadoFirma == null)
            {
                signed = false;
                return signed;
            }

            try
            {
                //CARGO DOCUMENTO PARA FIRMAR
                Document document = LoadXmlFromString(xmlUnsigned);
                DataToSign dataToSign = new DataToSign();
                dataToSign.setXadesFormat(EnumFormatoFirma.XAdES_BES);
                dataToSign.setEsquema(XAdESSchemas.XAdES_132);
                dataToSign.setXMLEncoding("UTF-8");
                dataToSign.setEnveloped(enveloped: true);
                dataToSign.addObject(new ObjectToSign(new InternObjectToSign("comprobante"), "contenido comprobante", null, "text/xml", null));
                dataToSign.setParentSignNode("comprobante");
                dataToSign.setDocument(document);

                //FIRMA XML
                var signXml = new FirmaXML();
                object[] objArray = signXml.signFile(certificadoFirma, dataToSign, privateKey, provider);

                byte[] byteXmlSigned = GetBytesFromDocument(document);
                switch (byteXmlSigned)
                {
                    case null:
                        signed = false;
                        return signed;
                    default:
                        xmlSigned = System.Text.Encoding.UTF8.GetString(byteXmlSigned);
                        break;
                }
                //GUARDABA DOCUMENTO EN PC
                /* FileOutputStream fileOutputStream = new FileOutputStream(signedXmlPath); //path donde guardar
                UtilidadTratarNodo.saveDocumentToOutputStream((Document)objArray[0], (java.io.OutputStream)fileOutputStream, true);
                fileOutputStream.close(); */
            }
            catch (Exception ex)
            {
                signed = false;
                LogWritter.LogError(dirLogs, "Error al firmar el comprobante: " + ex.Message);
            }
            return signed;
        }
    }
}