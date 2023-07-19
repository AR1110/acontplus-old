import "./NotFound.css";

export default function NotFound() {
  return (
    <section id="wrapper" className="error-page">
      <div className="error-box">
        <div className="error-body text-center">
          <h1>404</h1>
          <h3 className="text-uppercase">Page Not Found !</h3>
          <p className="text-muted m-t-30 m-b-30">
            YOU SEEM TO BE TRYING TO FIND HIS WAY HOME
          </p>
          <a
            href="index.html"
            className="btn btn-info btn-rounded waves-effect waves-light m-b-40 text-white"
          >
            Back to home
          </a>{" "}
        </div>
      </div>
    </section>
  );
}
