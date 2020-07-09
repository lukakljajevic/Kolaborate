using Api.Helpers.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Issue
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public string Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }
        
        public string DueDate { get; set; }
        
        [Required]
        public string CreatedAt { get; set; }
        
        [Required]
        public string IssueType { get; set; }

        [Required]
        public int Priority { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        [MaxLength(450)]
        public string CreatedBy { get; set; }

        [Required]
        [MaxLength(256)]
        public string CreatedByUsername { get; set; }

        [Required]
        [MaxLength(255)]
        public string CreatedByFullName { get; set; }

        [Required]
        public string PhaseId { get; set; }
        public Phase Phase { get; set; }

        public ICollection<IssueLabel> IssueLabels { get; set; }
        public ICollection<IssueUser> IssuedTo { get; set; }

        public Issue()
        {
            IssueLabels = new List<IssueLabel>();
            IssuedTo = new List<IssueUser>();
        }
    }
}
