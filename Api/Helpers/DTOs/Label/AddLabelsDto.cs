﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class AddLabelsDto
    {
        public ICollection<string> Labels { get; set; }
    }
}
