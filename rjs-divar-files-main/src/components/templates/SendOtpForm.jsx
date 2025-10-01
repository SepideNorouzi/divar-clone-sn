import { sendOtp } from "services/auth";
// check vite.config.js for explaination.

import styles from "./SendOtpForm.module.css";

function SendOtpForm({ setStep, mobile, setMobile }) {
  const submitHandler = async (event) => {
    event.preventDefault();
    // bc the default attitude of submit is to happen in a short moment and reload the form,
    // so when u try to log the data, it is shown only in matter of seconds and then disappears.
    if (mobile.length !== 11) return;

    const { response, error } = await sendOtp(mobile);
    // It calls sendOtp(mobile),
    //  which is a function that sends the number to your server's API.
    if (response) setStep(2);
    // If the server responds successfully, it calls setStep(2) to switch
    // the view to the CheckOtpForm component.
    if (error) console.log(error.response.data.message);

    console.log({ response, error });
  };

  return (
    <form onSubmit={submitHandler} className={styles.form}>
      <p>ورود به حساب کابری</p>
      <span>
        برای استفاده از امکانات دیوار، لطفا شماره موبایل خود را وارد کنید. کد
        تایید به این شماره پیامک خواهد شد.
      </span>
      <label htmlFor="input"> شماره موبایل خود را وارد کنید</label>
      <input
        type="text"
        id="input"
        placeholder="شماره موبایل"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button type="submit">ارسال کد تایید</button>
      {/* when the type is submit, when the button is clicked, it submits the whole form 
that the button is in */}
    </form>
  );
}
// the reason we used submit this way, is bc even if u hit the enter on your keyboard
// it works the same as pressing the button and submits the data. it is more professional.

export default SendOtpForm;
