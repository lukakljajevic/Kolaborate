using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class IssueDetailDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DueDate { get; set; }
        public string CreatedAt { get; set; }
        public string IssueType { get; set; }
        public int Priority { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedByUsername { get; set; }
        public string CreatedByFullName { get; set; }
        public PhaseListItemDto Phase { get; set; }
        public ICollection<LabelDto> Labels { get; set; }
        public ICollection<UserDto> IssuedTo { get; set; }
    }
}
