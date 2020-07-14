using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class RemovedUsernameFromIssueUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "IssueUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "IssueUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
