using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Loyalty.Domain.Enums;

namespace Loyalty.Application.Models;

public class RewardApplicationResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; }
    public decimal RewardValue { get; set; }
    public RewardType RewardType { get; set; }
    public string Description { get; set; }
}
