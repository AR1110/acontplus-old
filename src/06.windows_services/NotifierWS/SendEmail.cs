using Logs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using Nustache.Core;
using System.Text.RegularExpressions;

namespace NotifierWS
{
    public class SendEmail
    {
        private readonly string _path = "";
        public SendEmail()
        {
            _path = ConfigurationManager.AppSettings["dirLogs"].ToString();
        }
        public bool Send(Email email)
        {
            var mail = new MailMessage();
            var client = new SmtpClient();
            try
            {
                mail.To.Clear();

                mail.From = new MailAddress(email.from);
                mail.To.Add(email.to.Trim());
                mail.BodyEncoding = Encoding.UTF8;
                //mail.Body = email.message;
                mail.Subject = email.subject;
                mail.IsBodyHtml = true;
                mail.Priority = MailPriority.High;
                mail.SubjectEncoding = Encoding.UTF8;


                if (email.cc != "" && email.cc != null)
                {
                    MailAddress cC = new MailAddress(email.cc.Trim().Trim());
                    mail.CC.Add(cC);
                }
                var pathToHTMLFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "EmailTemplate.html");

                string htmlString = File.ReadAllText(pathToHTMLFile);

                var dataMail = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(email.dataMail);

                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                Dictionary<string, string> dataEmail = new Dictionary<string, string>();
                foreach (var paramRdlc in dataMail.FirstOrDefault())
                {
                    dataEmail.Add(paramRdlc.Key, paramRdlc.Value);
                }
                var emailBody = ProcessTemplate(htmlString, dataEmail);
                //mail.Body = emailBody;

                // Create an alternate view and add it to the email.
                var altView = AlternateView.CreateAlternateViewFromString(emailBody, null, MediaTypeNames.Text.Html);
                mail.AlternateViews.Add(altView);

                var pathLogo = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logos", email.logo);


                var linkedResource = new LinkedResource(pathLogo, "image/jpg");
                linkedResource.ContentId = "Pic1";
                altView.LinkedResources.Add(linkedResource);

                if (email.files != null)
                {
                    if (email.files.Count > 0)
                    {
                        foreach (var formFile in email.files)
                        {
                            //var target = new MemoryStream();
                            var dataFile = new Attachment(new MemoryStream(formFile.Content), formFile.FileName, formFile.ContentType);
                            // Add time stamp information for the file.
                            ContentDisposition disposition = dataFile.ContentDisposition;
                            disposition.CreationDate = File.GetCreationTime(formFile.FileName);
                            disposition.ModificationDate = File.GetLastWriteTime(formFile.FileName);
                            disposition.ReadDate = File.GetLastAccessTime(formFile.FileName);
                            mail.Attachments.Add(dataFile);
                        }
                    }
                }
                client.Credentials = new NetworkCredential(email.from, email.pwd);
                client.Host = email.host;
                client.Port = email.port;
                client.EnableSsl = email.enableSsl;
                client.DeliveryFormat = SmtpDeliveryFormat.International;
                client.Send(mail);
                mail.Dispose();
                client.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                LogWritter.LogError(_path, "Error al enviar por correo el documento: " + ex.Message);
                return false;
            }
        }
        private static string ProcessTemplate(string template,
           Dictionary<string, string> data)
        {
            //return Regex.Replace(template, "\\{\\{(.*?)\\}\\}", m =>
            //    m.Groups.Count > 1 && data.ContainsKey(m.Groups[1].Value) ? 
            //        data[m.Groups[1].Value] : m.Value);
            return Render.StringToString(template, data);
        }
    }
}
