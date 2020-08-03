using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs.Comment
{
    public class CommentCreateDto
    {
        public string IssueId { get; set; }
        public string Text { get; set; }
    }
}
