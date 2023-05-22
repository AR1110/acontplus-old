using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dtos
{
    public class WhatsappDto
    {
        public string number { get; set; }
        public string caption { get; set; }
        public string data { get; set; }
        public string mimeType { get; set; }
        public string fileName { get; set; }
    }
}
