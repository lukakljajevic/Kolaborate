using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class PhaseDetailDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public ICollection<IssueListItemDto> Issues { get; set; }
        public ProjectListItemDto Project { get; set; }
    }
}
