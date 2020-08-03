using Api.Data;
using Api.Helpers;
using Api.Helpers.DTOs.Comment;
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
    public class CommentsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBugTrackerRepository _repo;

        public CommentsController(IMapper mapper, IBugTrackerRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // POST /api/comments
        public async Task<IActionResult> Create([FromBody] CommentCreateDto dto)
        {
            var userId = User.GetUserId();
            var user = await _repo.GetUser(userId);
            //var issue = await _repo.GetIssue(dto.IssueId);

            var comment = new Comment
            {
                Text = dto.Text,
                CreatedAt = DateTime.Now,
                CreatedById = userId,
                IssueId = dto.IssueId,
                CreatedBy = user
            };

            _repo.Add(comment);

            if (await _repo.SaveAll())
            {
                var commentToReturn = _mapper.Map<CommentDto>(comment);
                return Ok(commentToReturn);
            }

            return BadRequest();
        }

        // PUT /api/comments/:id
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] CommentUpdateDto dto)
        {
            var userId = User.GetUserId();
            var comment = await _repo.GetComment(id);

            if (comment.CreatedById != userId) return Unauthorized();

            comment.Text = dto.Text;

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

        // DELETE /api/comments/:id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var userId = User.GetUserId();
            var comment = await _repo.GetComment(id);

            if (comment.CreatedById != userId) return Unauthorized();

            _repo.Delete(comment);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }
    }
}
