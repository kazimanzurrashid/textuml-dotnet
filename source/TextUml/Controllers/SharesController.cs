namespace TextUml.Controllers
{
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using Models;
    using Services;

    [Authorize]
    public class SharesController : ApiController
    {
        private readonly IShareService service;

        public SharesController(IShareService service)
        {
            this.service = service;
        }

        public HttpResponseMessage Get(int id)
        {
            var result = service.Query(id);

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage Put(int id, IEnumerable<ShareEdit> models)
        {
            service.Update(
                id,
                models,
                () =>
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                });

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}