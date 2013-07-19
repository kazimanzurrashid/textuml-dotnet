namespace TextUml.Controllers
{
    using System.Threading.Tasks;
    using System.Web.Mvc;

    using Models;
    using Services;

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

        public async Task<ActionResult> Index()
        {
            var model = IsAuthenticated ?
                await documentService.Query(new DocumentsQuery()) :
                new PagedQueryResult<DocumentRead>();

            return View(model);
        }
    }
}