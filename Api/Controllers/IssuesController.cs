using Api.Constants;
using Api.Data;
using Api.Helpers;
using Api.Helpers.DTOs;
using Api.Helpers.DTOs.Attachment;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IssuesController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBugTrackerRepository _repo;

        public IssuesController(IMapper mapper, IBugTrackerRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // GET /api/issues
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.GetUserId();
            var issueUsers = await _repo.GetIssueUsers(userId);
            var issuesToReturn = _mapper.Map<IssueUserListItemDto[]>(issueUsers);
            return Ok(issuesToReturn);

        }

        // GET /api/issues/:id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var userId = User.GetUserId();
            var issue = await _repo.GetIssue(id);
            
            if (issue != null)
            {
                var issueToReturn = _mapper.Map<IssueDetailDto>(issue);
                return Ok(issueToReturn);
            }
            return NotFound("Issue not found.");
        }

        // POST /api/issues
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IssueCreateDto dto)
        {
            var userId = User.GetUserId();
            var user = await _repo.GetUser(userId);

            if (user == null) return NotFound(new { message = "User not found" });

            var project = await _repo.GetProject(dto.ProjectId, userId);
            if (project == null) return NotFound(new { message = "Project not found." });

            var phase = project.Phases.FirstOrDefault(p => p.Id == dto.PhaseId);
            if (phase == null) return NotFound(new { message = "Phase not found." });

            var issue = _mapper.Map<Issue>(dto);

            issue.CreatedById = userId;
            issue.CreatedAt = DateTime.Today.ToShortDateString();
            issue.PhaseId = dto.PhaseId;
            issue.Status = Status.TO_DO;

            _repo.Add(issue);

            if (dto.Labels != null)
            {
                foreach (var id in dto.Labels)
                {
                    var label = await _repo.GetLabel(id);
                    var il = new IssueLabel
                    {
                        IssueId = issue.Id,
                        LabelId = label.Id,
                        Issue = issue,
                        Label = label
                    };
                    issue.IssueLabels.Add(il);
                }
            }
            

            foreach (var id in dto.IssuedTo)
            {
                var iu = new IssueUser
                {
                    IssueId = issue.Id,
                    UserId = id
                };
                issue.IssuedTo.Add(iu);
            }


            if (await _repo.SaveAll())
            {
                var issueToReturn = _mapper.Map<IssueListItemDto>(issue);
                return Ok(new { message = "Successfully created the issue", issue = issueToReturn });
            }

            return BadRequest(new { message = "Error saving the issue." });
        }

        // PUT /api/issues/:id
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] IssueUpdateDto dto)
        {
            var issue = await _repo.GetIssue(id);
            
            if (dto.Labels != null)
            {
                issue.IssueLabels = new List<IssueLabel>();
                foreach (var labelId in dto.Labels)
                {
                    var label = await _repo.GetLabel(labelId);
                    issue.IssueLabels.Add(new IssueLabel
                    {
                        IssueId = id,
                        LabelId = labelId,
                        Label = label
                    });
                }
            }

            var phase = await _repo.GetPhase(dto.PhaseId);

            if (phase == null) return BadRequest();

            issue.Name = dto.Name;
            issue.Description = dto.Description;
            issue.IssueType = dto.IssueType;
            issue.DueDate = dto.DueDate;
            issue.PhaseId = dto.PhaseId;

            if (await _repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest(new { message = "Error updating the issue." });
        }

        // DELETE /api/issues/:id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.GetUserId();

            // Option 1: Check if the user has access to the project and then delete
            var issue = await _repo.GetIssue(id);

            if (issue == null) return NotFound(new { message = "Issue not found." });

            var projectId = issue.Phase.ProjectId;
            var projectUser = await _repo.GetProjectUser(projectId, userId);

            if (projectUser == null)
                return Unauthorized(new { message = "You do not have the authorization to delete the issue." });

            _repo.Delete(issue);

            if (await _repo.SaveAll())
            {
                var issueToReturn = _mapper.Map<IssueListItemDto>(issue);
                return Ok(new { message = "Successfully deleted the issue.", issue = issueToReturn });
            }

            return BadRequest(new { message = "Error deleting the issue." });
        }
        
        // POST /api/issues/:id/labels
        [HttpPost("{id}/labels")]
        public async Task<IActionResult> AddLabels([FromRoute] string id, [FromBody] AddLabelsDto dto)
        {
            var issue = await _repo.GetIssue(id);

            if (dto.Labels != null)
            {
                foreach (var labelId in dto.Labels)
                {
                    var label = await _repo.GetLabel(labelId);
                    issue.IssueLabels.Add(new IssueLabel
                    {
                        IssueId = id,
                        LabelId = labelId,
                        Label = label
                    });
                }
            }

            if (await _repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest(new { message = "Error adding labels to the issue." });
        }

        // POST /api/issues/:id/priority
        [HttpPost("{id}/priority")]
        public async Task<IActionResult> Priority([FromRoute] string id, [FromBody] UpdatePriorityDto dto)
        {
            var issue = await _repo.GetIssue(id);

            if (dto.Priority > 0)
                issue.Priority = dto.Priority;

            if (await _repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest(new { message = "Error adding labels to the issue." });
        }

        // POST /api/issues/:id/status
        [HttpPost("{id}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] string id, [FromBody] UpdateStatusDto dto)
        {
            var issue = await _repo.GetIssue(id);

            if (dto.Status != null)
                issue.Status = dto.Status;

            if (await _repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest(new { message = "Error adding labels to the issue." });
        }

        // POST /api/issues/:id/starred
        [HttpPost("{id}/starred")]
        public async Task<IActionResult> Starred([FromRoute] string id, [FromBody] IsStarredDto dto)
        {
            var userId = User.GetUserId();
            var issue = await _repo.GetIssue(id);
            var issuedTo = issue.IssuedTo.FirstOrDefault(user => user.UserId == userId);

            if (issuedTo == null)
                return NotFound(new { message = "User not found." });

            issuedTo.IsStarred = dto.IsStarred;

            if (await _repo.SaveAll())
                return Ok();
            return BadRequest(new { message = "Error updating the issue." });
        }

        // POST /api/issues/:id/assign
        [HttpPost("{id}/assign")]
        public async Task<IActionResult> Assign([FromRoute] string id, [FromBody] IssueAssignDto dto)
        {
            // check if user has permission
            var userId = User.GetUserId();
            var project = await _repo.GetProject(dto.ProjectId, userId);
            
            if (project == null)
                return Unauthorized(new { message = "You do not have the auhorization to assign the issue." });

            var issue = await _repo.GetIssue(id);
            issue.IssuedTo.Add(new IssueUser
            {
                IsStarred = false,
                IssueId = id,
                UserId = dto.User.Id,
            });

            if (await _repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest(new { message = "Error assigning the issue." });
        }

        // DELETE /api/issues/:issueId/assignee/:assigneeId
        [HttpDelete("{issueId}/assignee/{assigneeId}")]
        public async Task<IActionResult> DeleteAssignee([FromRoute] string issueId, [FromRoute] string assigneeId)
        {
            var userId = User.GetUserId();
            var issue = await _repo.GetIssue(issueId);

            if (issue.CreatedBy.Id != userId)
                return Unauthorized(new { message = "You do not have the authorization to remove assignees." });

            var issueUser = issue.IssuedTo.FirstOrDefault(iu => iu.UserId == assigneeId);

            if (issueUser == null)
                return NotFound(new { message = "Issued to user not found." });

            issue.IssuedTo.Remove(issueUser);

            if (await _repo.SaveAll())
                return Ok();
            return BadRequest(new { message = "Error deleting issued to user." });
        }

         
    }
}
