using Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class ProjectDetailDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string CompletedOn { get; set; }
        public string CreatedBy { get; set; }
        public ICollection<PhaseListItemDto> Phases { get; set; }
        public ICollection<ProjectUserListItemDto> ProjectUsers { get; set; }
    }
}
