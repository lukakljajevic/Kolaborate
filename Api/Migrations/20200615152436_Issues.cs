using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class Issues : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Phase_Projects_ProjectId",
                table: "Phase");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Phase",
                table: "Phase");

            migrationBuilder.RenameTable(
                name: "Phase",
                newName: "Phases");

            migrationBuilder.RenameIndex(
                name: "IX_Phase_ProjectId",
                table: "Phases",
                newName: "IX_Phases_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Phases",
                table: "Phases",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Issues",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 255, nullable: false),
                    Description = table.Column<string>(maxLength: 255, nullable: false),
                    DueDate = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<string>(nullable: false),
                    IssueType = table.Column<string>(nullable: false),
                    Priority = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(maxLength: 450, nullable: false),
                    PhaseId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Issues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Issues_Phases_PhaseId",
                        column: x => x.PhaseId,
                        principalTable: "Phases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_Issues_AspNetUsers",
                        column: x => x.CreatedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Labels",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IssueLabels",
                columns: table => new
                {
                    IssueId = table.Column<string>(nullable: false),
                    LabelId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IssueLabels", x => new { x.IssueId, x.LabelId });
                    table.ForeignKey(
                        name: "FK_IssueLabels_Issues_IssueId",
                        column: x => x.IssueId,
                        principalTable: "Issues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IssueLabels_Labels_LabelId",
                        column: x => x.LabelId,
                        principalTable: "Labels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IssueLabels_LabelId",
                table: "IssueLabels",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "IX_Issues_PhaseId",
                table: "Issues",
                column: "PhaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Phases_Projects_ProjectId",
                table: "Phases",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Phases_Projects_ProjectId",
                table: "Phases");

            migrationBuilder.DropTable(
                name: "IssueLabels");

            migrationBuilder.DropTable(
                name: "Issues");

            migrationBuilder.DropTable(
                name: "Labels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Phases",
                table: "Phases");

            migrationBuilder.RenameTable(
                name: "Phases",
                newName: "Phase");

            migrationBuilder.RenameIndex(
                name: "IX_Phases_ProjectId",
                table: "Phase",
                newName: "IX_Phase_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Phase",
                table: "Phase",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Phase_Projects_ProjectId",
                table: "Phase",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
