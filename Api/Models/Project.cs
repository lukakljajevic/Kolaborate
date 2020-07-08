using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Project
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public string Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string Description { get; set; }

        [MaxLength(10)]
        public string StartDate { get; set; }

        [MaxLength(10)]
        public string EndDate { get; set; }

        [MaxLength(10)]
        public string CompletedOn { get; set; }

        [Required]
        [MaxLength(450)]
        public string CreatedBy { get; set; }

        [Required]
        public string CreatedByFullName { get; set; }

        public ICollection<Phase> Phases { get; set; }
        public ICollection<ProjectUser> ProjectUsers { get; set; }
    }
}
