using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Phase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public string Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [Required]
        public int Index { get; set; }

        [Required]
        public string ProjectId { get; set; }
        public Project Project { get; set; }

        public ICollection<Issue> Issues { get; set; }
    }
}
