using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs.Issue
{
    public class IssueUserDetailDto
    {
        public IssueListItemDto Issue { get; set; }
        public UserDto User { get; set; }
        public bool IsStarred { get; set; }
    }
}
