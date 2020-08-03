using Api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectUser> ProjectUsers { get; set; }
        public DbSet<Phase> Phases { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<IssueLabel> IssueLabels { get; set; }
        public DbSet<Issue> Issues { get; set; }
        public DbSet<IssueUser> IssueUsers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProjectUser>()
                .HasKey(pu => new { pu.ProjectId, pu.UserId });

            modelBuilder.Entity<IssueLabel>()
                .HasKey(il => new { il.IssueId, il.LabelId });

            modelBuilder.Entity<IssueUser>()
                .HasKey(iu => new { iu.IssueId, iu.UserId });
        }
    }
}
