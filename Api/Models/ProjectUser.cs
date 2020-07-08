using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Models
{
    public class ProjectUser
    {
        public string ProjectId { get; set; }
        public Project Project { get; set; }
        
        [Required]
        [MaxLength(450)]
        public string UserId { get; set; }
        
        [Required]
        public string UserFullName { get; set; }

        [Required]
        public string UserRole { get; set; }
        public DateTime? LastActive { get; set; }
    }
}
