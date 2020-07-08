using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [MaxLength(255)]
        public string FullName { get; set; }
    }
}
