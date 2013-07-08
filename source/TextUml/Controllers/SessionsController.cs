namespace TextUml.Controllers
{
    using System;
    using System.Globalization;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using Models;
    using Services;

    public class SessionsController : ApiController
    {
        private readonly IMembershipService membershipService;

        public SessionsController(IMembershipService membershipService)
        {
            this.membershipService = membershipService;
        }

        public HttpResponseMessage Post(CreateSession model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest, ModelState);
            }

            var success = membershipService.SignIn(
                model.Email.ToLower(CultureInfo.CurrentCulture),
                model.Password,
                model.RememberMe.GetValueOrDefault());

            return Request.CreateResponse(success ?
                HttpStatusCode.NoContent :
                HttpStatusCode.BadRequest);
        }

        [Authorize]
        public HttpResponseMessage Delete()
        {
            membershipService.SignOut();
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}