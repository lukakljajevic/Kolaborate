using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class IssueAssignDto
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public string UserFullName { get; set; }
        public string ProjectId { get; set; }
    }
}
