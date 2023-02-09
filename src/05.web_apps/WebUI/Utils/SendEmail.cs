using Domain.Models;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;

namespace WebUI.Utils
{
    public class SendEmail
    {
        public bool Send(Email email)
        {
            var mail = new MailMessage();
            var server = new SmtpClient();
            bool response;
            try
            {
                mail.To.Clear();
                mail.BodyEncoding = System.Text.Encoding.UTF8;
                mail.Body = email.message;
                mail.Subject = email.subject;
                mail.IsBodyHtml = true;
                mail.To.Add(email.to.Trim());
                mail.Priority = MailPriority.High;

                if (email.cc != "" && email.cc != null)
                {
                    MailAddress cC = new MailAddress(email.cc.Trim().Trim());
                    mail.CC.Add(cC);
                }

                if (email.files != null)
                {
                    if (email.files.Count > 0)
                    {
                        foreach (var formFile in email.files)
                        {
                            //var target = new MemoryStream();
                            //long size = email.files.Sum(f => f.Length);

                            ////// full path to file in temp location
                            //var filePath = Path.GetTempFileName();

                            //if (formFile.Length > 0)
                            //{
                            //    using var stream = new FileStream(filePath, FileMode.Create);
                            //    formFile.CopyTo(target);
                            //}
                            //Stream file = new MemoryStream(target.ToArray());
                            // Create  the file attachment for this email message. 
                            var data = new Attachment(new MemoryStream(formFile.Content), formFile.FileName, formFile.ContentType);
                            // Add time stamp information for the file.
                            ContentDisposition disposition = data.ContentDisposition;
                            disposition.CreationDate = File.GetCreationTime(formFile.FileName);
                            disposition.ModificationDate = File.GetLastWriteTime(formFile.FileName);
                            disposition.ReadDate = File.GetLastAccessTime(formFile.FileName);
                            mail.Attachments.Add(data);
                        }
                    }
                }
                mail.From = new MailAddress(email.from);
                server.Credentials = new NetworkCredential(email.from, email.password);
                server.Host = "smtp.gmail.com";
                server.Port = 587;
                server.EnableSsl = true;
                server.Send(mail);
                response = true;
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                response = false;
            }
            return response;
        }
    }
}
