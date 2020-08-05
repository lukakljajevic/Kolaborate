using Api.Data;
using Api.Helpers;
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
    public class AttachmentsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBugTrackerRepository _repo;

        public AttachmentsController(IMapper mapper, IBugTrackerRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // POST /api/attachments
        [HttpPost(), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAttachment([FromForm] AddAttachmentDto dto)
        {
            var userId = User.GetUserId();

            if (dto.Attachment != null)
            {
                var attachment = dto.Attachment;
                var folderName = Path.Combine("Resources", "Attachments", dto.IssueId);
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                var fileName = ContentDispositionHeaderValue.Parse(attachment.ContentDisposition).FileName.Trim('"');

                var fullPath = Path.Combine(pathToSave, fileName);

                while (System.IO.File.Exists(fullPath))
                {
                    var fileNameNoExt = fileName.Split('.')[0];
                    var ext = fileName.Split('.')[1];

                    if (fileNameNoExt.Length > 8 &&
                        fileNameNoExt.Substring(fileNameNoExt.Length - 7, 4) == "Copy")
                    {
                        var copyNumber = int.Parse(fileNameNoExt[fileNameNoExt.Length - 2].ToString());
                        fileNameNoExt = $"{fileNameNoExt.Substring(0, fileNameNoExt.Length - 2)}{++copyNumber})";
                    }
                    else
                    {
                        fileNameNoExt += "(Copy-1)";
                    }

                    fileName = $"{fileNameNoExt}.{ext}";

                    fullPath = Path.Combine(pathToSave, fileName);
                }

                var dbPath = Path.Combine(folderName, fileName);

                if (!Directory.Exists(pathToSave))
                    Directory.CreateDirectory(pathToSave);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    attachment.CopyTo(stream);
                }

                var newAttachment = new Attachment
                {
                    Url = dbPath,
                    CreatedById = userId,
                    IssueId = dto.IssueId,
                    Size = Convert.ToInt32(attachment.Length)
                };

                _repo.Add(newAttachment);

                if (await _repo.SaveAll())
                {
                    newAttachment.CreatedBy = await _repo.GetUser(newAttachment.CreatedById);
                    var attachmentToReturn = _mapper.Map<AttachmentDto>(newAttachment);
                    return Ok(attachmentToReturn);
                }

                return BadRequest();

            }

            return BadRequest();


        }

        // DELETE /api/attachments/:id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var userId = User.GetUserId();
            var attachment = await _repo.GetAttachment(id);

            if (attachment.CreatedById != userId) return Unauthorized();

            var fullPath = $"C:\\Users\\Luka\\Desktop\\BugTracker\\Api\\{attachment.Url}";
            
            System.IO.File.Delete(fullPath);

            _repo.Delete(attachment);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }
    }
}
