using System.Collections.Generic;

namespace NotifierWS
{
    public class Email
    {
        public string host { get; set; }
        public int port { get; set; }
        public bool enableSsl { get; set; }
        public string logo { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string cc { get; set; }
        public string pwd { get; set; }
        public string subject { get; set; }
        public string dataMail { get; set; }
        public List<FileModel> files { get; set; }
        public Email() { }
    }
}
