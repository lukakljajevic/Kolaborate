using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Attachment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public string Id { get; set; }

        [Required]
        public string Url { get; set; }

        [Required]
        public int Size { get; set; }

        [Required]
        public string CreatedById { get; set; }

        public User CreatedBy { get; set; }

        [Required]
        public string IssueId { get; set; }

        public Issue Issue { get; set; }
    }
}
