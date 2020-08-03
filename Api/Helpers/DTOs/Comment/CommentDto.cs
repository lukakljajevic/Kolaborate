using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs.Comment
{
    public class CommentDto
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public UserDto CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
