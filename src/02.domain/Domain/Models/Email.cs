using System.Collections.Generic;

namespace Domain.Models
{
    public class Email
    {
        public string template { get; set; }
        public string host { get; set; }
        public int port { get; set; }
        public bool enableSsl { get; set; }
        public string logo { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string cc { get; set; }
        public string password { get; set; }
        public string subject { get; set; }
        public string message { get; set; }        
        public string dataMail { get; set; }
        public List<FileModel> files { get; set; }
        public Email() { }
    }
}
