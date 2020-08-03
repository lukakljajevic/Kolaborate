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
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBugTrackerRepository _repo;

        public ProjectsController(IMapper mapper, IBugTrackerRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        //GET /api/projects
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var userId = User.GetUserId();
            var projects = await _repo.GetProjects(userId);
            var projectsToReturn = _mapper.Map<ProjectListItemDto[]>(projects);
            return Ok(projectsToReturn);
        }


        // POST /api/projects
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProjectCreateDto dto)
        {
            if (!dto.IsValid()) return BadRequest(new { message = "Invalid information" });

            var userId = User.GetUserId();
            var user = await _repo.GetUser(userId);

            if (user == null) return NotFound(new { message = "User not found" });

            var newProject = _mapper.Map<Project>(dto);
            newProject.CreatedById = userId;

            _repo.Add(newProject);

            if (await _repo.SaveAll())
            {
                var projectUser = new ProjectUser
                {
                    ProjectId = newProject.Id,
                    UserId = userId,
                    UserRole = Roles.MANAGER,
                    LastActive = DateTime.Now
                };
                
                _repo.Add(projectUser);

                if (await _repo.SaveAll())
                {
                    return Ok(new { id = newProject.Id });
                }

                return BadRequest(new { message = "Error saving user data." });
            }

            return BadRequest(new { message = "Error creating the project."});
        }

        // GET /api/projects/:id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var userId = User.GetUserId();
            var project = await _repo.GetProject(id, userId);
            if (project != null)
            {
                var projectUser = await _repo.GetProjectUser(id, userId);
                projectUser.LastActive = DateTime.Now;
                if (await _repo.SaveAll())
                {
                    project.ProjectUsers = await _repo.GetProjectUsers(project.Id);
                    var projectDetailDto = _mapper.Map<ProjectDetailDto>(project);
                    return Ok(projectDetailDto);
                }
                return BadRequest(new { message = "Unable to update last active." });
            }

            return NotFound(new { message = "Project not found." });
        }

        // PUT /api/projects/:id
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] ProjectCreateDto dto)
        {
            if (!dto.IsValid()) return BadRequest(new { message = "Invalid information" });

            var userId = User.GetUserId();
            var project = await _repo.GetProject(id, userId);
            
            if (project == null) return NotFound("Project not found.");

            project.Name = dto.Name;
            project.Description = dto.Description;
            project.StartDate = dto.StartDate;
            project.EndDate = dto.EndDate;

            if (await _repo.SaveAll())
                return Ok(new
                {
                    project.Name,
                    project.Description,
                    project.StartDate,
                    project.EndDate
                });

            return BadRequest();
        }

        // DELETE /api/projects/:id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.GetUserId();
            var project = await _repo.GetProject(id, userId);
            if (project == null)
            {
                return NotFound("Project not found.");
            }
            _repo.Delete(project);
            
            if (await _repo.SaveAll())
            {
                return Ok(new { message = "Project successfully deleted." });
            }
            return BadRequest(new { message = "Error deleting the project." });

        }

        // GET /api/projects/recent
        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentProjects()
        {
            var userId = User.GetUserId();
            var projects = await _repo.GetRecentProjects(userId);
            var projectsToReturn = _mapper.Map<ProjectListItemDto[]>(projects);
            return Ok(projectsToReturn);
        }

        // POST /api/projects/invite
        [HttpPost("invite")]
        public async Task<IActionResult> AddUserToProject([FromBody] ProjectInviteDto dto)
        {
            var userId = User.GetUserId();
            var projectUser = await _repo.GetProjectUser(dto.ProjectId, userId);
            if (projectUser == null || projectUser.UserRole != Roles.MANAGER)
            {
                return Unauthorized("You are not authorized to invite users.");
            }

            var newProjectUser = _mapper.Map<ProjectUser>(dto);

            _repo.Add(newProjectUser);

            if (await _repo.SaveAll())
            {
                newProjectUser.User = await _repo.GetUser(newProjectUser.UserId);
                var projectUserToReturn = _mapper.Map<ProjectUserDto>(newProjectUser);
                return Ok(new { message = "Successfully added the user.", projectUser = projectUserToReturn});
            }

            return BadRequest("Error adding the user.");
        }
    }
}
