// import { useLocation, Link } from "react-router-dom";

type Param = {
  title: string;
  childrenButton?: JSX.Element[] | JSX.Element;
  textButton: string;
  handleClick?: () => void;
};
export default function Breadcrumbs({ title, textButton, handleClick }: Param) {
  // const location = useLocation();

  // const currentLink = "";

  // const crumbs = location.pathname
  //   .split("/")
  //   .filter((crumb) => crumb !== "")
  //   .map((crumb) => {
  //     currentLink += `/${crumb}`;

  //     return (
  //       <div className="crumb" key={crumb}>
  //         <Link to={currentLink}>{crumb}</Link>
  //       </div>
  //     );
  //   });

  return (
    <div className="row page-titles">
      <div className="col-md-5 align-self-center">
        <h4 className="text-themecolor">{title}</h4>
      </div>
      <div className="col-md-7 align-self-center text-end">
        <div className="d-flex justify-content-end align-items-center">
          {/* <ol className="breadcrumb justify-content-end">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">Home</a>
          </li>
          <li className="breadcrumb-item active">Calendar</li>
        </ol> */}
          {handleClick ? (
            <button
              type="button"
              className="btn btn-info d-none d-lg-block m-l-15 text-white"
              onClick={handleClick}
            >
              <i className="fa fa-plus-circle"></i> {textButton}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
