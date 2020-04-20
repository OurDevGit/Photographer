import React from "react";
import { Spin, Icon } from "antd";

export default function LoadingIndicator(props) {
  const antIcon = (
    <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />
  );
  return (
    <Spin
      indicator={antIcon}
      style={{
        display: "block",
        textAlign: "center",
        zIndex: 50,
        margin: "30px auto",
      }}
    />
  );
}
