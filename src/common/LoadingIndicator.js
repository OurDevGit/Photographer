import React from "react";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons"
export default function LoadingIndicator(props) {
  // const antIcon = (
  //   <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />
  // );
  return (
    <Spin
      indicator={<Loading3QuartersOutlined style={{ fontSize: 30 }} spin/>}
      style={{
        display: "block",
        textAlign: "center",
        zIndex: 50,
        margin: "30px auto",
      }}
    />
  );
}
