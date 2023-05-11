using Common.Logs;
using Domain.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Scriban;
using System.Dynamic;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;

namespace BL.Notificacion
{
    public class SendEmail
    {
        private readonly IConfiguration _configuration;
        public SendEmail(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public bool Send(Email email, ref string msgError)
        {
            LogWriter _log = new LogWriter(_configuration);
            MailMessage message = new MailMessage();

            try
            {

                message.To.Clear();
                message.IsBodyHtml = true;
                message.BodyEncoding = Encoding.UTF8;

                message.From = new MailAddress(email.from);
                message.To.Add(email.to.Trim());
                //mail.Body = email.message;
                message.Subject = email.subject;
                message.Priority = MailPriority.High;
                message.SubjectEncoding = Encoding.UTF8;


                if (email.cc != "" && email.cc != null)
                {
                    MailAddress cC = new MailAddress(email.cc.Trim().Trim());
                    message.CC.Add(cC);
                }
                string pathToHTMLFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", email.template);

                string htmlString = File.ReadAllText(pathToHTMLFile);

                //var dataMail = JsonConvert.DeserializeObject<Dictionary<string, string>>(email.dataMail);
                var dataMail = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, object>>>(email.dataMail).FirstOrDefault();


                //Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                //Dictionary<string, string> dataEmail = new Dictionary<string, string>();
                //foreach (var paramRdlc in dataMail.FirstOrDefault())
                //{
                //    dataEmail.Add(paramRdlc.Key, paramRdlc.Value);
                //}
                string emailBody = ProcessTemplate(htmlString, dataMail);
                //mail.Body = emailBody;

                // Create an alternate view and add it to the email.
                AlternateView altView = AlternateView.CreateAlternateViewFromString(emailBody, null, MediaTypeNames.Text.Html);
                message.AlternateViews.Add(altView);

                //string pathLogo = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logos", email.logo);

                string pathLogo = Path.Combine(_configuration.GetSection("Media").GetSection("Images").Value, "Logos", email.logo);

                LinkedResource linkedResource = new LinkedResource(pathLogo, "image/jpg");
                linkedResource.ContentId = "Pic1";
                altView.LinkedResources.Add(linkedResource);

                if (email.files != null)
                {
                    if (email.files.Count > 0)
                    {
                        foreach (var formFile in email.files)
                        {
                            //var target = new MemoryStream();
                            Attachment dataFile = new Attachment(new MemoryStream(formFile.Content), formFile.FileName, formFile.ContentType);
                            // Add time stamp information for the file.
                            ContentDisposition disposition = dataFile.ContentDisposition;
                            disposition.CreationDate = File.GetCreationTime(formFile.FileName);
                            disposition.ModificationDate = File.GetLastWriteTime(formFile.FileName);
                            disposition.ReadDate = File.GetLastAccessTime(formFile.FileName);
                            message.Attachments.Add(dataFile);
                        }
                    }
                }
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                                      | SecurityProtocolType.Tls11
                                      | SecurityProtocolType.Tls12;
                SmtpClient smtpClient = new SmtpClient();
                smtpClient.Host = email.host;
                smtpClient.Port = email.port;
                smtpClient.EnableSsl = email.enableSsl;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(email.from, email.password);
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Send(message);
            }
            catch (Exception ex)
            {
                if (message != null)
                {
                    message.Dispose();
                }
                msgError = ex.Message;
                _log.LogError("Error al enviar por correo la notificación: " + ex.ToString());
                return false;
            }
            finally
            {
                message.Dispose();
            }
            return true;
        }
        //private static string ProcessTemplate(string template, IDictionary<string, object> data)
        //{
        //    //return Regex.Replace(template, "\\{\\{(.*?)\\}\\}", m =>
        //    //    m.Groups.Count > 1 && data.ContainsKey(m.Groups[1].Value) ? 
        //    //        data[m.Groups[1].Value] : m.Value);
        //    return Render.StringToString(template, data);
        //}
        private static string ProcessTemplate(string template, IDictionary<string, object> data)
        {
            ExpandoObject reportData = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(data));

            var scriptObject = new Scriban.Runtime.ScriptObject();
            foreach (var prop in reportData)
            {
                scriptObject.Add(prop.Key, prop.Value);
            }
            var templateTo = Template.Parse(template);
            return templateTo.Render(scriptObject, member => LowerFirstCharacter(member.Name));
        }

        private static string LowerFirstCharacter(string value)
        {
            if (value.Length > 1)
                return char.ToLower(value[0]) + value.Substring(1);
            return value;
        }
    }
}
