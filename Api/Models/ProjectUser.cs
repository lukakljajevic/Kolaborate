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
        [Required]
        public string ProjectId { get; set; }
        public Project Project { get; set; }
        
        [Required]
        public string UserId { get; set; }
        public User User { get; set; }

        [Required]
        public string UserRole { get; set; }
        public DateTime? LastActive { get; set; }
    }
}
