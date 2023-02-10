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
                string pathToHTMLFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "EmailTemplate.html");

                string htmlString = File.ReadAllText(pathToHTMLFile);

                var dataMail = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(email.dataMail);

                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                Dictionary<string, string> dataEmail = new Dictionary<string, string>();
                foreach (var paramRdlc in dataMail.FirstOrDefault())
                {
                    dataEmail.Add(paramRdlc.Key, paramRdlc.Value);
                }
                string emailBody = ProcessTemplate(htmlString, dataEmail);
                //mail.Body = emailBody;

                // Create an alternate view and add it to the email.
                AlternateView altView = AlternateView.CreateAlternateViewFromString(emailBody, null, MediaTypeNames.Text.Html);
                message.AlternateViews.Add(altView);

                string pathLogo = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logos", email.logo);


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
                using (SmtpClient smtpClient = new SmtpClient())
                {
                    smtpClient.Host = email.host;
                    smtpClient.Port = email.port;
                    smtpClient.EnableSsl = email.enableSsl;

                    NetworkCredential NetworkCred = new NetworkCredential();
                    NetworkCred.UserName = email.from;
                    NetworkCred.Password = email.pwd;
                    smtpClient.Credentials = NetworkCred;

                    smtpClient.DeliveryFormat = SmtpDeliveryFormat.International;
                    smtpClient.Send(message);
                }
            }
            catch (Exception ex)
            {
                if (message != null)
                {
                    message.Dispose();
                }
                LogWritter.LogError(_path, "Error al enviar por correo el documento: " + ex.ToString());
                return false;
            }
            finally
            {
                message.Dispose();
            }
            return true;
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
