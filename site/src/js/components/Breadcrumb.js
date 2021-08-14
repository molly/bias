import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Breadcrumb({ path }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {path.map((pathItem, ind) => {
          const fullPath = `/${path
            .map((p) => p.path)
            .slice(0, ind + 1)
            .join("/")}`;
          console.log(fullPath);
          return (
            <li
              className={`breadcrumb-item ${pathItem.active ? "active" : ""}`}
              aria-current={pathItem.active ? "page" : null}
              key={pathItem.path}
            >
              {pathItem.active ? (
                pathItem.title
              ) : (
                <Link to={fullPath}>{pathItem.title}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumb.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
};
