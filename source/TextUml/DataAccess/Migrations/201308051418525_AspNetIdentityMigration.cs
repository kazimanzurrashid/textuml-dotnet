namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AspNetIdentityMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Users",
                c => new
                {
                    Id = c.String(false, 128),
                    UserName = c.String(maxLength: 256),
                })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName);

            CreateTable(
                "dbo.UserClaims",
                c => new
                {
                    Key = c.String(false, 128),
                    UserId = c.String(maxLength: 128),
                    ClaimType = c.String(),
                    ClaimValue = c.String(),
                })
                .PrimaryKey(t => t.Key)
                .Index(t => t.UserId);

            CreateTable(
                "dbo.UserSecrets",
                c => new
                {
                    UserName = c.String(false, 256),
                    Secret = c.String(),
                })
                .PrimaryKey(t => t.UserName);

            CreateTable(
                "dbo.UserLogins",
                c => new
                {
                    LoginProvider = c.String(false, 128),
                    ProviderKey = c.String(false, 128),
                    UserId = c.String(maxLength: 128),
                })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey })
                .Index(t => t.UserId);

            CreateTable(
                "dbo.Roles",
                c => new
                {
                    Id = c.String(false, 128),
                })
                .PrimaryKey(t => t.Id);

            CreateTable(
                "dbo.UserRoles",
                c => new
                {
                    RoleId = c.String(false, 128),
                    UserId = c.String(false, 128),
                })
                .PrimaryKey(t => new { t.RoleId, t.UserId });
        }

        public override void Down()
        {
            DropIndex("dbo.Users", new[] { "UserName" });
            DropIndex("dbo.UserClaims", new[] { "UserId" });
            DropIndex("dbo.UserLogins", new[] { "UserId" });

            DropTable("dbo.UserRoles");
            DropTable("dbo.Roles");
            DropTable("dbo.UserLogins");
            DropTable("dbo.UserSecrets");
            DropTable("dbo.UserClaims");
            DropTable("dbo.Users");
        }
    }
}