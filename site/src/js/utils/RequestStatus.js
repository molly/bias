import PropTypes from "prop-types";

export default class RequestStatus {
  constructor({
    uninitialized = false,
    pending = false,
    succeeded = false,
    failed = false,
    error = null,
  } = {}) {
    this.uninitialized = uninitialized;
    this.pending = pending;
    this.succeeded = succeeded;
    this.failed = failed;

    this.error = error;
  }

  static uninitialized() {
    return new RequestStatus({ uninitialized: true });
  }

  static pending() {
    return new RequestStatus({ pending: true });
  }

  static succeeded() {
    return new RequestStatus({ succeeded: true });
  }

  static failed(error = null) {
    return new RequestStatus({ failed: true, error: error });
  }
}

export const RequestStatusPropType = PropTypes.instanceOf(RequestStatus);
