namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class UserMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.tu_Users",
                c => new
                {
                    Id = c.Int(false, true),
                    Email = c.String(false, 256)
                })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Email, true);
        }

        public override void Down()
        {
            DropIndex("dbo.tu_Users", new[] { "Email" });
            DropTable("dbo.tu_Users");
        }
    }
}