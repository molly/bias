import PropTypes from "prop-types";

export default PropTypes.shape({
  citations: PropTypes.object.isRequired,
  domain_usages: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  total_usages: PropTypes.number.isRequired,
});
