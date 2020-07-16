using Api.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Models
{
    public class IssueUser
    {
        [Required]
        public string IssueId { get; set; }
        public Issue Issue { get; set; }
        
        [Required]
        [MaxLength(450)]
        public string UserId { get; set; }

        [MaxLength(255)]
        public string Username { get; set; }

        [MaxLength(255)]
        public string FullName { get; set; }
        public bool IsStarred { get; set; }

    }
}
