using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class IssueUpdateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string DueDate { get; set; }
        public string IssueType { get; set; }
        public ICollection<string> Labels { get; set; }
    }
}
