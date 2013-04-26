namespace TextUml.Controllers
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using Models;

    [Authorize]
    public class DocumentsController : ApiController
    {
        private readonly IDocumentService service;

        public DocumentsController(IDocumentService service)
        {
            this.service = service;
        }

        public HttpResponseMessage Get([FromUri]DocumentsQuery command)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            }

            var result = service.Query(command);

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage Get(int id)
        {
            var result = service.One(
                id,
                () =>
                    {
                        throw new HttpResponseException(
                            HttpStatusCode.NotFound);
                    });

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage Post(DocumentEdit model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            }

            var result = service.Create(model);
            var response = Request.CreateResponse(
                HttpStatusCode.Created,
                result);

            var location = Url.Link("DefaultApi", new { id = result.Id });

            if (location != null)
            {
                response.Headers.Location = new Uri(location);
            }

            return response;
        }

        public HttpResponseMessage Put(int id, DocumentEdit model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            }

            var result = service.Update(
                id,
                model,
                () =>
                    {
                        throw new HttpResponseException(
                            HttpStatusCode.NotFound);
                    });

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public HttpResponseMessage Delete(int id)
        {
            service.Delete(
                id,
                () =>
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                });

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}