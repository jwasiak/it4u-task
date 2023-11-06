import { css } from "@emotion/css";
import formBg from "./form-bg.png";

export const formCss = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-family: "Roboto Slab";
  background-color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  /* background-image: url(${formBg}); */
  margin: auto;
  max-width: 556px;
  min-height: 535px;
  padding: 4% 6%;
  font-size: 0.75rem;
  color: #15593d;
  input {
    font-family: sans-serif;
    padding: 1.5rem 0.5rem;
    background-color: rgba(0, 0, 0, 0.09);
    border-radius: 0;
    border: 0;
    &::placeholder {
      text-align: center;
      color: #15593d;
    }
  }
  div.checkboxes {
    margin-bottom: 1rem;
  }
  div.button {
    text-align: center;
    margin-bottom: 1rem;
    button {
      font-family: "Jost";
      font-weight: bold;
      font-size: 2rem;
      color: #fff;
      background-color: #a6b33d;
      padding: 0.2rem 5rem;
      border-radius: 0;
    }
  }

  div.administrator {
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
    a {
      color: #15593d;
    }
  }
`;
