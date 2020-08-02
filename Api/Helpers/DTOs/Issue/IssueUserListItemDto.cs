using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class IssueUserListItemDto
    {
        public bool IsStarred { get; set; }
        public IssueListItemDto Issue { get; set; }
        public UserDto User { get; set; }
    }
}
