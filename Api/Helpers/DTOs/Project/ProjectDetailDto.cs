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
        public UserDto CreatedBy { get; set; }

        public ICollection<PhaseDetailDto> Phases { get; set; }
        public ICollection<ProjectUserDto> ProjectUsers { get; set; }
    }
}
