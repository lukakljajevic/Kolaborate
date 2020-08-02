using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs
{
    public class ProjectCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string CreatedBy { get; set; }

        public bool IsValid()
        {
            if (string.IsNullOrEmpty(Name))
            {
                return false;
            }

            if (StartDate == null && EndDate != null)
            {
                return false;
            }

            if (StartDate != null && EndDate != null && DateTime.Compare(DateTime.Parse(StartDate), DateTime.Parse(EndDate)) >= 0) 
            {
                return false;
            }

            return true;
        }
    }
}
