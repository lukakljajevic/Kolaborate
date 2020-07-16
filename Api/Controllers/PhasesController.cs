using Api.Constants;
using Api.Data;
using Api.Helpers;
using Api.Helpers.DTOs;
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
    [Route("api/projects/{projectId}/[controller]")]
    public class PhasesController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBugTrackerRepository _repo;

        public PhasesController(IMapper mapper, IBugTrackerRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // POST /api/projects/{projectId}/phases
        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] string projectId, [FromBody] PhaseCreateDto phaseCreateDto)
        {
            var userId = User.GetUserId();
            var project = await _repo.GetProject(projectId, userId);

            if (project == null)
            {
                return NotFound("Project not found.");
            }

            var phase = new Phase
            {
                Name = phaseCreateDto.Name,
                ProjectId = project.Id,
                //Project = project,
                Index = project.Phases.Count
            };

            _repo.Add(phase);

            if (await _repo.SaveAll())
            {
                var phaseListItem = _mapper.Map<PhaseDetailDto>(phase);
                return Ok(new { phase = phaseListItem });
            }

            return BadRequest(new { message = "Unable to create the phase." });
        }

        // PUT /api/projects/{projectId}/phases/{phaseId}
        [HttpPut("{phaseId}")]
        public async Task<IActionResult> Update([FromRoute] string projectId, [FromRoute] string phaseId, [FromBody] PhaseUpdateDto dto)
        {
            var userId = User.GetUserId();
            var projectUser = await _repo.GetProjectUser(projectId, userId);

            if (projectUser == null)
                return Unauthorized(new { message = "You do not have access to the project." });

            var phase = await _repo.GetPhase(phaseId);
            phase.Name = dto.Name;

            if (await _repo.SaveAll())
                return Ok();
            return BadRequest(new { message = "Error updating the phase." });


        }

        // POST /api/phases
        [HttpPost]
        [Route("/api/phases")]
        public async Task<IActionResult> UpdatePhases([FromBody] PhasesUpdateDto dto)
        {
            var succeeded = await _repo.UpdatePhases(dto.Phases);
            if (succeeded)
            {
                return Ok(new { message = "Successfully updated the phases." });
            }
            return BadRequest(new { message = "Unable to update the phases." });
        }

        // DELETE /api/projects/{projectId}/phases/:id
        [HttpDelete("{phaseId}")]
        public async Task<IActionResult> Delete([FromRoute] string projectId, string phaseId)
        {
            var userId = User.GetUserId();

            var projectUser = await _repo.GetProjectUser(projectId, userId);
            if (projectUser == null || projectUser.UserRole == Roles.USER)
                return Unauthorized(new { message = "You do not have the authorization to delete the phase." });

            var project = await _repo.GetProject(projectUser.ProjectId, projectUser.UserId);
            var phase = project.Phases.FirstOrDefault(p => p.Id == phaseId);
            if (phase == null)
                return NotFound(new { message = "Phase not found." });

            project.Phases.Remove(phase);

            var count = 0;
            foreach (var p in project.Phases)
            {
                p.Index = count++;
            }

            var phasesToReturn = _mapper.Map<PhaseDetailDto[]>(project.Phases);

            if (await _repo.SaveAll())
                return Ok(new { message = "Successfully deleted the phase.", phases = phasesToReturn });

            return BadRequest(new { message = "Error deleting the phase." });
        }
    }
}
