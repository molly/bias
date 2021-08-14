import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

export default function FAQEntry({
  id,
  headerText,
  children,
  activeAnchor,
  updateUrl,
}) {
  return (
    <div id={id}>
      <h5
        id={`${id}-header`}
        className={`d-inline ${id === activeAnchor ? "highlighted" : ""}`}
      >
        <a onClick={() => updateUrl(id)} className="anchor-icon" role="button">
          <FontAwesomeIcon icon={faLink} />
          <span className="visually-hidden">Anchor</span>
        </a>{" "}
        {headerText}
      </h5>
      {children}
    </div>
  );
}

FAQEntry.propTypes = {
  id: PropTypes.string.isRequired,
  headerText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  activeAnchor: PropTypes.string,
  updateUrl: PropTypes.func.isRequired,
};
