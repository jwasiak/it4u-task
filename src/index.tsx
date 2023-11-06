import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import Form from "./Form/index.jsx";

const wrapper = createRoot(document.getElementById("wrapper")!);

wrapper.render(<Form />);
