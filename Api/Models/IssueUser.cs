﻿using Api.Models;
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
        public string UserId { get; set; }
        public User User { get; set; }

        public bool IsStarred { get; set; }

    }
}
