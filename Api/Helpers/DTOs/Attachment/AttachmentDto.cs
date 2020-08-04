using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs.Attachment
{
    public class AttachmentDto
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public UserDto CreatedBy { get; set; }
        public int Size { get; set; }
    }
}
