import PropTypes from "prop-types";

export default PropTypes.shape({
  accuracy: PropTypes.number,
  accuracy_str: PropTypes.string.isRequired,
  bias: PropTypes.number,
  bias_str: PropTypes.string,
  display_name: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rater: PropTypes.oneOf(["mbfc", "rsp"]).isRequired,
  rater_url: PropTypes.string.isRequired,
  source_url: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
});
