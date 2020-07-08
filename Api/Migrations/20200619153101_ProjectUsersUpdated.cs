using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class ProjectUsersUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserFullName",
                table: "ProjectUsers",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserFullName",
                table: "ProjectUsers");
        }
    }
}
