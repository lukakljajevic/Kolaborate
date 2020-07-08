using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Models
{
    public class IssueLabel
    {
        public string IssueId { get; set; }
        public Issue Issue { get; set; }
        public string LabelId { get; set; }
        public Label Label { get; set; }
    }
}
