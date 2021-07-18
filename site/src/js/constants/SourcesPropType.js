import PropTypes from "prop-types";

export default PropTypes.shape({
  citations: PropTypes.object.isRequired,
  domains: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  total_usages: PropTypes.number.isRequired,
});
