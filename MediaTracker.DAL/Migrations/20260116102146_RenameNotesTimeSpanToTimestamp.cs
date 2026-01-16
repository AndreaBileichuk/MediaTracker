using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediaTracker.DAL.Migrations
{
    /// <inheritdoc />
    public partial class RenameNotesTimeSpanToTimestamp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TimeSpan",
                schema: "App",
                table: "Notes",
                newName: "Timestamp");

            migrationBuilder.RenameColumn(
                name: "CreateAt",
                schema: "App",
                table: "Notes",
                newName: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Timestamp",
                schema: "App",
                table: "Notes",
                newName: "TimeSpan");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                schema: "App",
                table: "Notes",
                newName: "CreateAt");
        }
    }
}
