import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { checkOtp } from "services/auth";
import { getProfile } from "services/user";
import { setCookie } from "utils/cookie";
// check vite.config.js for explaination.

import styles from "./CheckOtpForm.module.css";

function CheckOtpForm({ code, setCode, mobile, setStep }) {
  const navigate = useNavigate();

  const { refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile(),
  });

  const submitHandler = async (event) => {
    event.preventDefault();

    if (code.length !== 5) return;

    const { response, error } = await checkOtp(mobile, code);
    // It calls checkOtp(mobile, code) to ask your server if the code is
    // correct for that mobile number.
    // If the code is correct, the server sends back access and refresh tokens.
    navigate("/");
    // after login, naigate the user to homepage
    refetch(["profile"]);
    // so that after navigating to homepage, we fetch the data and get it again to use it in
    // different parts of the homepage
    console.log(response);

    if (response) {
      setCookie(response.data);
      // setCookie(response.data): This is a crucial step. It saves these
      // tokens as cookies in the user's browser. Now, the user is considered "logged in."
    }
    if (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <form onSubmit={submitHandler} className={styles.form}>
      <p> تایید کد پیامک شده</p>
      <span>کد پیامک شده به شماره{mobile} را واد کنید.</span>
      <label htmlFor="input">کد تایید را وارد کنید</label>
      <input
        type="text"
        id="input"
        value={code}
        placeholder="کد تایید"
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit">ورود</button>
      <button onClick={() => setStep(1)} className={styles.backButton}>تغییر شماره موبایل</button>
    </form>
  );
}

export default CheckOtpForm;
