import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { formCss } from "./styles.js";

const api =
  "https://test8.it4u.company/sapi/modules/contact/form/40042ce28394dc369948c018b22c534d";

const emailRegex =
  /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

Yup.addMethod(Yup.string, "email", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

const FormSchema = Yup.object({
  name: Yup.string().required("Imię jest wymagane"),
  email: Yup.string()
    .email("Podaj poprawny adres email")
    .required("Email jest wymagany"),
  phone: Yup.string()
    .max(9, "Niepoprawna długość 9")
    .matches(/^(?:[0-9]{9}|)$/, "Nieprawidłowy nr telefonu"),
  agreement_mail: Yup.boolean().when("email", {
    is: (value: string) => value && value.length > 0,
    then: (schema) => schema.oneOf([true], "Wyrażenie zgody jest wymagane"),
  }),
  agreement_call: Yup.boolean().test({
    name: "phone_agreement",
    message: "Wyrażenie jednej ze zgód jest wymagane",
    test: function () {
      if (!(this.parent.phone && this.parent.phone.length === 9)) {
        return true;
      } else {
        return this.parent.agreement_call || this.parent.agreement_sms;
      }
    },
  }),
  agreement_sms: Yup.boolean().test({
    name: "phone_agreement",
    message: "Wyrażenie jednej ze zgód jest wymagane",
    test: function () {
      if (!(this.parent.phone && this.parent.phone.length === 9)) {
        return true;
      } else {
        return this.parent.agreement_call || this.parent.agreement_sms;
      }
    },
  }),
  error_test: Yup.string().notRequired(),
});

type Form = Yup.InferType<typeof FormSchema>;

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: yupResolver(FormSchema) });

  const [count, setCount] = useState<number>(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverContent, setServerContent] = useState<string>("");

  const htmlResponse = (content: string) => {
    return {
      __html: content,
    };
  };

  const onSubmit: SubmitHandler<Form> = async (data) => {
    setServerContent("");
    setServerError(null);
    const formData = new FormData();
    for (const [name, value] of Object.entries(data)) {
      formData.append(name, String(value));
    }
    formData.set("error_test", data.email);
    // testowe wysłanie błędnego emaila
    if (count % 10 === 0) {
      formData.set("error_test", "");
      formData.set("email", "");
    }
    setCount(count + 1);
    const response = await fetch(api, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const responseData = await response.json();
      if (responseData?.result === "OK") {
        setServerContent(responseData.content);
      }
      if (responseData?.result === "INVALID") {
        setServerError(responseData.error.error_test);
      }
    }
  };

  return (
    <form className={formCss} onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("error_test")} />
      <div className="form-group">
        <input
          className="form-control"
          type="text"
          id="name"
          placeholder="IMIĘ i NAZWISKO"
          {...register("name", { required: true })}
        />
        {errors?.name?.message && (
          <small className="form-text text-danger">
            {errors?.name?.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <input
          className="form-control"
          type="text"
          id="phone"
          placeholder="TELEFON"
          {...register("phone")}
        />
        {errors?.phone?.message && (
          <small className="form-text text-danger">
            {errors?.phone?.message}
          </small>
        )}
      </div>
      <div dangerouslySetInnerHTML={htmlResponse(serverContent)} />
      <div className="form-group">
        <input
          className="form-control"
          type="test"
          id="email"
          placeholder="EMAIL"
          {...register("email", { required: true })}
        />
        {errors?.email?.message && (
          <small className="form-text text-danger">
            {errors?.email?.message}
          </small>
        )}
        {serverError && (
          <small className="form-text text-danger">{serverError}</small>
        )}
      </div>

      <p>
        Wyrażam zgodę na otrzymywanie od Duda Developement Sp. z o.o. SKA z
        siedzibą w Poznaniu ul. Macieja Palacza 144, 60-278 Poznań, informacji
        handlowej
      </p>
      <div className="checkboxes">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="agreement_mail"
            {...register("agreement_mail", { required: true })}
          />
          <label className="form-check-label" htmlFor="agreement_mail">
            w formie elektronicznej (mail), na wskazany adres mailowy
          </label>

          {errors?.agreement_mail?.message && (
            <small className="form-text text-danger">
              {errors?.agreement_mail?.message}
            </small>
          )}
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="agreement_call"
            {...register("agreement_call")}
          />
          <label className="form-check-label" htmlFor="agreement_call">
            drogą telefoniczną, na udostępniony numer telefonu
          </label>
          {errors?.agreement_call?.message && (
            <small className="form-text text-danger">
              {errors?.agreement_call?.message}
            </small>
          )}
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="agreement_sms"
            {...register("agreement_sms")}
          />
          <label className="form-check-label" htmlFor="agreement_sms">
            w formie SMS, na udostępniony numer telefonu
          </label>
          {errors?.agreement_sms?.message && (
            <small className="form-text text-danger">
              {errors?.agreement_sms?.message}
            </small>
          )}
        </div>
      </div>
      <div className="button">
        <button type="submit" className="btn">
          WYŚLIJ
        </button>
      </div>

      <div className="administrator">
        <a href="#">Kto będzie administratorem Twoich danych osobowych?</a>
      </div>
    </form>
  );
};

export default Form;
