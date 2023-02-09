using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.ViewModels
{
    public class PrinterViewModel
    {
        public bool isDefault { get; set; }
        public bool isNetwork { get; set; }
        public string name { get; set; }
        public string state { get; set; }
    }
}
