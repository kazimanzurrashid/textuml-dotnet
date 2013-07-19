namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class InvitationMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.tu_Invitations",
                c => new
                {
                    Id = c.Int(false, true),
                    Email = c.String(false, 128),
                    DocumentId = c.Int(false),
                    CanEdit = c.Boolean(false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.tu_Documents", t => t.DocumentId);

            CreateIndex(
                "dbo.tu_Invitations",
                new[] { "DocumentId", "Email" },
                true);
        }

        public override void Down()
        {
            DropIndex("dbo.tu_Invitations", new[] { "DocumentId", "Email" });

            DropForeignKey("dbo.tu_Invitations", "DocumentId", "dbo.tu_Documents");

            DropTable("dbo.tu_Invitations");
        }
    }
}