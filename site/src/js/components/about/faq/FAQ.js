import React, { useMemo } from "react";
import { useHistory, useLocation } from "react-router";
import usagesImg from "../../../../images/usages.png";

import Breadcrumb from "../../Breadcrumb";
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
      <Breadcrumb
        path={[
          { title: "About", path: "about" },
          { title: "FAQ", path: "faq", active: true },
        ]}
      />
      <h1 className="display-1">FAQ</h1>
      <FAQEntry
        id="usages"
        headerText='What does "usages" mean?'
        activeAnchor={activeAnchor}
        updateUrl={updateUrl}
      >
        <div>
          References can be reused in Wikipedia articles, so this shows the
          number of times this reference is used, as well as the percentage of
          total reference usages in an article. Please note that if there are
          multiple distinct references with the same content, they are counted
          separately; consider editing the article to{" "}
          <a href="https://en.wikipedia.org/w/index.php?title=Wikipedia:DUPREF">
            combine duplicate references
          </a>
          .
          <div className="img-fluid image-container">
            <img
              className="image"
              src={usagesImg}
              alt="See https://en.wikipedia.org/wiki/User:GorillaWarfare/bias/usages"
              style={{ maxWidth: "500px", padding: "10px" }}
            />
          </div>
          In this example, reference A has one usage and reference B has three.
          Reference A is 25% (1/4) of the total usages, and reference B is 75%
          (3/4).
        </div>
      </FAQEntry>
    </div>
  );
}
