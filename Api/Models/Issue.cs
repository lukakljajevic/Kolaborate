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
        public string CreatedById { get; set; }
        public User CreatedBy { get; set; }

        [Required]
        public string PhaseId { get; set; }

        [Required]
        public Phase Phase { get; set; }

        public ICollection<IssueLabel> IssueLabels { get; set; }
        public ICollection<IssueUser> IssuedTo { get; set; }
        public ICollection<Comment> Comments { get; set; }

        public Issue()
        {
            IssueLabels = new List<IssueLabel>();
            IssuedTo = new List<IssueUser>();
        }
    }
}
