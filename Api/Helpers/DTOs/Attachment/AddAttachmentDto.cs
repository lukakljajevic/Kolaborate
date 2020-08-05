using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs.Attachment
{
    public class AddAttachmentDto
    {
        public string IssueId { get; set; }
        public IFormFile Attachment { get; set; }
    }
}
