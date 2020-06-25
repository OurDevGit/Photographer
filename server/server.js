import express from "express";
import fs from "fs";
import path from "path";

import React from "react";
import ReactDOMServer from "react-dom/server";
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import configureStore, { history } from '../src/redux/configureStore'
import App from "../src/App";

const PORT = 8000;

const app = express();

app.use("^/$", (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Some error happened");
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(
        <AppContainer>
          <Provider store={store}>
            <App history={history} />
          </Provider>
        </AppContainer>)}</div>`
      )
    );
  });
});

app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`);
});