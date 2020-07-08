using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class IssueUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IssueUsers",
                columns: table => new
                {
                    IssueId = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(maxLength: 450, nullable: false),
                    IsStarred = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IssueUsers", x => new { x.IssueId, x.UserId });
                    table.ForeignKey(
                        name: "FK_IssueUsers_Issues_IssueId",
                        column: x => x.IssueId,
                        principalTable: "Issues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_IssueUsers_AspNetUsers",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IssueUsers");
        }
    }
}
