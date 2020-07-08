using Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class IssueCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string DueDate { get; set; }
        public string IssueType { get; set; }
        public int Priority { get; set; }
        public string ProjectId { get; set; }
        public string PhaseId { get; set; }

        public ICollection<string> Labels { get; set; }
        public ICollection<string> IssuedTo { get; set; }
    }
}
