using Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class IssueListItemDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string IssueType { get; set; }
        public ICollection<LabelDto> Labels { get; set; }
        public ProjectListItemDto Project { get; set; }
        public string PhaseId { get; set; }
        public string Status { get; set; }
        public ICollection<string> IssuedToUserIds { get; set; }
    }
}
