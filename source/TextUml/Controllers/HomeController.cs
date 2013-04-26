namespace TextUml.Controllers
{
    using System.Web.Mvc;

    using Models;

    public class HomeController : Controller
    {
        private readonly IDocumentService documentService;
        private bool? authenticated;

        public HomeController(IDocumentService documentService)
        {
            this.documentService = documentService;
        }

        public bool IsAuthenticated
        {
            get
            {
                if (authenticated == null)
                {
                    authenticated = Request.IsAuthenticated;
                }

                return authenticated.GetValueOrDefault();
            }

            set
            {
                authenticated = value;
            }
        }

        public ActionResult Index()
        {
            var command = new DocumentsQuery();
            var model = IsAuthenticated ?
                documentService.Query(command) :
                new PagedQueryResult<DocumentRead>();

            return View(model);
        }
    }
}