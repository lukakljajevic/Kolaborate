using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Avatar { get; set; }

    }
}
