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

const Avartar = ({ fullname, status, avartarUrl }) => (
  <div className="avatar">
    <div className="avatar-main">
      {avartarUrl ? (
        <img src="https://picktur.s3.eu-central-1.amazonaws.com/AV_1583980643306-images_(3).jpg" />
      ) : (
        <div className="short-username">{fullname[0].toUpperCase()}</div>
      )}

      <AvartarBadge status={status || "online"} />
    </div>
  </div>
);

Avartar.propTypes = {
  fullname: PropTypes.string.isRequired,
  status: PropTypes.string,
  avartarUrl: PropTypes.string
};

AvartarBadge.propTypes = {
  status: PropTypes.string,
};

export default Avartar;
