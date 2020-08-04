using Api.Helpers.DTOs.Attachment;
using Api.Helpers.DTOs.Comment;
using Api.Helpers.DTOs.Issue;
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
        
        public UserDto CreatedBy { get; set; }
        public PhaseListItemDto Phase { get; set; }
        
        public ICollection<LabelDto> Labels { get; set; }
        public ICollection<IssueUserDetailDto> IssuedTo { get; set; }
        public ICollection<CommentDto> Comments { get; set; }
        public ICollection<AttachmentDto> Attachments { get; set; }
    }
}
