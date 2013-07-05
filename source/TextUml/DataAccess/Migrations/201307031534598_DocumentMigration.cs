namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class DocumentMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.tu_Documents",
                c => new
                {
                    Id = c.Int(false, true),
                    Title = c.String(false, 128),
                    Content = c.String(true, isMaxLength: true),
                    CreatedAt = c.DateTime(false),
                    UpdatedAt = c.DateTime(false),
                    UserId = c.Int(false)
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.tu_Users", t => t.UserId);

            CreateIndex("dbo.tu_Documents", new[] { "UserId", "Title", "UpdatedAt", "CreatedAt" });
        }

        public override void Down()
        {
            DropIndex("dbo.tu_Documents", new[] { "UserId", "Title", "UpdatedAt", "CreatedAt" });
            DropForeignKey("dbo.tu_Documents", "UserId", "dbo.tu_Users");
            DropTable("dbo.tu_Documents");
        }
    }
}