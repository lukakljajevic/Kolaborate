using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class IssueUpdateDto
    {
        public string Status { get; set; }
        public int Priority { get; set; }

        public ICollection<string> Labels { get; set; }
    }
}
