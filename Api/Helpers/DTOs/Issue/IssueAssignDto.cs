﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class IssueAssignDto
    {
        public UserDto User { get; set; }
        public string ProjectId { get; set; }
    }
}
