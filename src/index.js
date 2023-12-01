import ReactDOM from "react-dom/client";
import "./input.css";
import { FastAdmin } from "./FastAdmin";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <FastAdmin />
  </BrowserRouter>
);
