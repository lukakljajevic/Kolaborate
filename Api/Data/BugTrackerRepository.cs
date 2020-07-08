using Api.Helpers.DTOs;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Api.Data
{
    public interface IBugTrackerRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<Project> GetProject(string projectId, string userId);
        Task<IEnumerable<Project>> GetProjects(string userId);
        Task<IEnumerable<Project>> GetRecentProjects(string userId);
        Task<ProjectUser> GetProjectUser(string projectId, string userId);
        Task<IEnumerable<Label>> GetLabels();
        Task<bool> UpdatePhases(IEnumerable<PhaseListItemDto> phases);
        Task<ICollection<ProjectUser>> GetProjectUsers(string projectId);
        Task<Label> GetLabel(string labelId);
        Task<ICollection<IssueUser>> GetIssueUsers(string userId);
        Task<Issue> GetIssue(string id);
        Task<Phase> GetPhase(string id);

    }

    public class BugTrackerRepository : IBugTrackerRepository
    {
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public BugTrackerRepository(AppDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        public void Add<T>(T entity) where T : class => _context.Add(entity);

        public void Delete<T>(T entity) where T : class => _context.Remove(entity);

        public async Task<bool> SaveAll() => await _context.SaveChangesAsync() > 0;

        public async Task<Project> GetProject(string projectId, string userId)
        {
            var project = await _context.ProjectUsers
                .Where(pu => pu.ProjectId == projectId && pu.UserId == userId)
                .Include(pu => pu.Project)
                    .ThenInclude(project => project.Phases)
                        .ThenInclude(phase => phase.Issues)
                            .ThenInclude(issue => issue.IssuedTo)
                .Include(pu => pu.Project)
                    .ThenInclude(project => project.Phases)
                        .ThenInclude(phase => phase.Issues)
                            .ThenInclude(issue => issue.IssueLabels)
                                .ThenInclude(issueLabel => issueLabel.Label)
                .Select(pu => pu.Project)
                .FirstOrDefaultAsync();

            project.Phases = project.Phases.OrderBy(p => p.Index).ToList();
            
            
            return project;
        }

        public async Task<IEnumerable<Project>> GetProjects(string userId)
        {
            return await _context.ProjectUsers
                .Where(pu => pu.UserId == userId)
                .Include(pu => pu.Project)
                .Select(pu => pu.Project)
                .ToListAsync();
        }

        public async Task<IEnumerable<Project>> GetRecentProjects(string userId)
        {
            return await _context.ProjectUsers
                .Where(pu => pu.UserId == userId)
                .OrderByDescending(pu => pu.LastActive)
                .Take(3)
                .Include(pu => pu.Project)
                .Select(pu => pu.Project)
                .ToListAsync();

        }

        public async Task<ProjectUser> GetProjectUser(string projectId, string userId)
        {
            return await _context.ProjectUsers
                .FirstOrDefaultAsync(pu => pu.ProjectId == projectId && pu.UserId == userId);
        }

        public async Task<IEnumerable<Label>> GetLabels()
        {
            return await _context.Labels.ToListAsync();
        }

        public async Task<bool> UpdatePhases(IEnumerable<PhaseListItemDto> phases)
        {
            foreach (var phase in phases)
            {
                var currentPhase = await _context.Phases.FirstOrDefaultAsync(p => p.Id == phase.Id);
                currentPhase.Index = phase.Index;
            }
            return await SaveAll();
        }

        public async Task<ICollection<ProjectUser>> GetProjectUsers(string projectId)
        {
            return await _context.ProjectUsers.Where(pu => pu.ProjectId == projectId).ToListAsync();
        }

        public async Task<Label> GetLabel(string labelId)
        {
            return await _context.Labels.FirstOrDefaultAsync(l => l.Id == labelId);
        }

        public async Task<ICollection<IssueUser>> GetIssueUsers(string userId)
        {
            return await _context.IssueUsers
                .Where(iu => iu.UserId == userId)
                .Include(iu => iu.Issue)
                .ThenInclude(i => i.Phase)
                .ThenInclude(p => p.Project)
                .ToListAsync();
        }

        public async Task<Issue> GetIssue(string id)
        {
            return await _context.Issues
                .Include(i => i.Phase)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Phase> GetPhase(string id)
        {
            return await _context.Phases
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
