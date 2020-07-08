using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class UpdatedProjectCreatedByFullName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedByFullName",
                table: "Projects",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByFullName",
                table: "Projects");
        }
    }
}
