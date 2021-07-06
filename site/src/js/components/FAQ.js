import React, { useMemo } from "react";
import { useHistory, useLocation } from "react-router";
import usagesImg from "../../images/usages.png";
import FAQEntry from "./FAQEntry";

export default function FAQ() {
  const history = useHistory();
  const location = useLocation();

  const updateUrl = (anchor) => {
    history.replace(`/faq#${anchor}`);
  };
  const activeAnchor = useMemo(
    () => (location.hash ? location.hash.slice(1) : null),
    [location]
  );

  return (
    <div className="container">
      <h1 className="display-1">FAQ</h1>
      <FAQEntry
        id="usages"
        headerText='What does "usages" mean?'
        activeAnchor={activeAnchor}
        updateUrl={updateUrl}
      >
        <p>
          References can be reused in Wikipedia articles, so this shows the
          number of times this reference is used, as well as the percentage of
          total reference usages in an article.
          <div className="img-fluid image-container">
            <img
              className="image"
              src={usagesImg}
              alt="See https://en.wikipedia.org/wiki/User:GorillaWarfare/bias/usages"
              style={{ maxWidth: "500px", padding: "10px" }}
            />
          </div>
          In this example, reference A has one usage and reference B has 3.
          Reference A is 25% (1/4) of the total usages, and reference B is 75%
          (3/4).
        </p>
      </FAQEntry>
    </div>
  );
}
