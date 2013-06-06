namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class ShareMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.tu_Shares",
                c =>
                new
                {
                    Id = c.Int(false, true),
                    DocumentId = c.Int(false),
                    UserId = c.Int(false),
                    Permissions = c.Int(false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.tu_Documents", t => t.DocumentId)
                .ForeignKey("dbo.tu_Users", t => t.UserId);

            CreateIndex("dbo.tu_Shares", new[] { "DocumentId", "UserId" });
        }

        public override void Down()
        {
            DropIndex("dbo.tu_Documents", new[] { "DocumentId", "UserId" });
            DropForeignKey("dbo.tu_Shares", "DocumentId", "dbo.tu_Documents");
            DropForeignKey("dbo.tu_Shares", "UserId", "dbo.tu_Users");
            DropTable("dbo.tu_Shares");
        }
    }
}