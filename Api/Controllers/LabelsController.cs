using Api.Data;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LabelsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBugTrackerRepository _repo;

        public LabelsController(IMapper mapper, IBugTrackerRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // GET /api/labels
        public async Task<IActionResult> Get()
        {
            var labels = await _repo.GetLabels();
            if (labels.Count() == 0)
            {
                return NotFound("Unable to get labels.");
            }
            return Ok(labels);
        }

        // POST /api/labels


    }
}
