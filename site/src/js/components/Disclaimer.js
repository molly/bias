import React from "react";
import pluralize from "../utils/pluralize";

export default function Disclaimer({ sources }) {
  if (sources.domains.unknown.citations === 0) {
    return "All sources were identified.";
  } else {
    let text;
    const total_unidentified_citations = sources.domains.unknown.citations;
    const percent_citations_unidentified = (
      (total_unidentified_citations / sources.total) *
      100
    ).toFixed();
    text = `${total_unidentified_citations} ${pluralize(
      "citation",
      total_unidentified_citations
    )} 
    (${percent_citations_unidentified}% of total citations) couldn't be identified.`;
    if (sources.total_usages) {
      const total_unidentified_usages = sources.domains.unknown.usages;
      const percent_usages_unidentified = (
        (total_unidentified_usages / sources.total_usages) *
        100
      ).toFixed();
      text += ` They make up ${total_unidentified_usages} ${pluralize(
        "usage",
        total_unidentified_usages
      )} (${percent_usages_unidentified}% of total usages).`;
    }
    return <span>{text}</span>;
  }
}
