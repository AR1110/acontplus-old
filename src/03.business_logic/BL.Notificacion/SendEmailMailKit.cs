using Common.Logs;
using Domain.Models;
using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Utils;
using Newtonsoft.Json;
using Scriban;
using System.Dynamic;
using System.Net;
using System.Net.Mime;

namespace BL.Notificacion
{
    public class SendEmailMailKit
    {
        private readonly IConfiguration _configuration;
        public SendEmailMailKit(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<bool> Send(Email email, CancellationToken ct = default)
        {
            LogWriter _log = new LogWriter(_configuration);
            MimeMessage message = new MimeMessage();

            try
            {
                message.To.Clear();
                message.From.Add(new MailboxAddress("Acontplus", email.from));
                message.Sender = new MailboxAddress("Acontplus", email.from);

                var receiver = email.to.Split(',');
                foreach (string mailAddress in receiver)
                    message.To.Add(MailboxAddress.Parse(mailAddress));


                if (email.cc != "" && email.cc != null)
                {
                    var cc = email.cc.Split(',');
                    foreach (string mailAddress in cc)
                        message.Bcc.Add(MailboxAddress.Parse(mailAddress));
                }

                var body = new BodyBuilder();

                message.Subject = email.subject;

                string pathToHTMLFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", email.template);

                string htmlString = File.ReadAllText(pathToHTMLFile);

                var dataMail = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, object>>>(email.dataMail).FirstOrDefault();

                string emailBody = ProcessTemplate(htmlString, dataMail);

                body.HtmlBody = emailBody;
                string pathLogo = Path.Combine(_configuration.GetSection("Media").GetSection("Images").Value, "Logos", email.logo);

                var image = body.LinkedResources.Add(pathLogo);
                image.ContentId = MimeUtils.GenerateMessageId();

                body.HtmlBody = body.HtmlBody.Replace("[img-src]", image.ContentId);

                if (email.files != null)
                {
                    if (email.files.Count > 0)
                    {
                        foreach (var formFile in email.files)
                        {
                            var extension = Path.GetExtension(formFile.FileName);
                            if (extension == ".pdf")
                            {
                                body.Attachments.Add(formFile.FileName, formFile.Content, MimeKit.ContentType.Parse(MediaTypeNames.Application.Pdf));
                            }
                            if (extension == ".xml")
                            {
                                body.Attachments.Add(formFile.FileName, formFile.Content, MimeKit.ContentType.Parse(MediaTypeNames.Application.Xml));
                            }
                        }
                    }
                }

                message.Body = body.ToMessageBody();

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                                      | SecurityProtocolType.Tls11
                                      | SecurityProtocolType.Tls12;

                SmtpClient smtpClient = new SmtpClient();
                //using SmtpClient smtpClient = new(new ProtocolLogger("smtp.log"));

                //if (email.enableSsl)
                //{
                //    await smtpClient.ConnectAsync(email.host, email.port, SecureSocketOptions.SslOnConnect, ct);
                //}
                //else
                //{
                //    await smtpClient.ConnectAsync(email.host, email.port, SecureSocketOptions.StartTls, ct);

                smtpClient.ServerCertificateValidationCallback = (s, c, h, e) => true;
                await smtpClient.ConnectAsync(email.host, email.port, SecureSocketOptions.StartTlsWhenAvailable, ct);
                await smtpClient.AuthenticateAsync(email.from, email.password, ct);
                await smtpClient.SendAsync(message, ct);
                await smtpClient.DisconnectAsync(true, ct);
                return true;
            }
            catch (Exception ex)
            {
                if (message != null)
                {
                    message.Dispose();
                }
                _log.LogError("Error al enviar por correo la notificación: " + ex.ToString());
                return false;
            }
            finally
            {
                message.Dispose();
            }
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
