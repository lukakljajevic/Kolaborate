using Api.Data;
using Api.Helpers.DTOs;
using Api.Helpers.DTOs.Label;
using Api.Models;
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
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var labels = await _repo.GetLabels();
            var labelsToReturn = _mapper.Map<LabelDto[]>(labels);
            return Ok(labelsToReturn);
        }

        // POST /api/labels
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LabelCreateDto dto)
		{
            if (dto.Name == null || dto.Name.Length == 0)
                return BadRequest(new { Message = "Label name cannot be empty." });

            var label = await _repo.FindLabelByName(dto.Name);
            if (label != null)
                return BadRequest(new { Message = "Label with this name already exists." });

            var newLabel = _mapper.Map<Label>(dto);
            _repo.Add(newLabel);

            if (await _repo.SaveAll())
			{
                var labelToReturn = _mapper.Map<LabelDto>(newLabel);
                return Ok(labelToReturn);
			}

            return BadRequest(new { Message = "Error creating the label." });


		}

    }
}
