import React from "react";
import PropTypes from "prop-types";
import { Image } from "semantic-ui-react";
import "./style.less";

const colorSchema = {
  offline: {
    secondary: "rgba(158, 158, 158, 0.6)",
    primary: "#EEEEEE",
  },
  online: {
    secondary: "rgba(59, 232, 218, 0.4)",
    primary: "#FF010102",
  },
};

const AvartarBadge = ({ status }) => (
  <div
    className="badge"
    style={{ backgroundColor: colorSchema[status].secondary }}
  >
    <div
      className="badge-inner"
      style={{ backgroundColor: colorSchema[status].primary }}
    />
  </div>
);

const Avartar = ({ fullname, status }) => (
  <div className="avatar">
    <div className="avatar-main">
      <div className="short-username">{fullname[0].toUpperCase()}</div>
      <AvartarBadge status={status || "online"} />
    </div>
  </div>
);

Avartar.propTypes = {
  fullname: PropTypes.string.isRequired,
  status: PropTypes.string,
};

AvartarBadge.propTypes = {
  status: PropTypes.string,
};

export default Avartar;
