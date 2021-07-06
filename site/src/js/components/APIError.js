import React from "react";
import { RequestStatusPropType } from "../utils/RequestStatus";

export default function APIError({ status }) {
  const getErrorMessage = () => {
    try {
      return status.error.response.data.message;
    } catch (e) {
      return "Something went wrong.";
    }
  };

  if (status.failed) {
    return (
      <div className="col-md-12">
        <div className="alert alert-danger" role="alert">
          {getErrorMessage()}
        </div>
      </div>
    );
  }
  return null;
}

APIError.propTypes = {
  status: RequestStatusPropType.isRequired,
};
