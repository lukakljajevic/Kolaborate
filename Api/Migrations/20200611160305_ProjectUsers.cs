using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class ProjectUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectUsers",
                columns: table => new
                {
                    ProjectId = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(maxLength: 450, nullable: false),
                    UserRole = table.Column<string>(nullable: false),
                    LastActive = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectUsers", x => new { x.ProjectId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ProjectUsers_Projects",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_ProjectUsers_AspNetUsers",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectUsers");
        }
    }
}
