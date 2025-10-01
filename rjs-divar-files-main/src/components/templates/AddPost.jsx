import { useState } from "react";
import axios from "axios";
// useQuery is a hook from React Query (or TanStack Query) for fetching, caching,
// and managing server-side data.
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getCategory } from "services/admin";
import { getCookie } from "utils/cookie";

import styles from "./AddPost.module.css";

function AddPost() {
  // useState is a React Hook that lets you add state to functional components.
  // It returns a stateful value and a function to update it.
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    city: "",
    amount: null,
    images: null,
  });

  // useQuery is used here to fetch the list of categories from the server.
  // The 'queryKey' is a unique identifier for the query, and 'queryFn' is the
  // function that performs the data fetching.
  const { data } = useQuery({
    queryKey: ["get-categories"],
    queryFn: getCategory,
  });

  // changeHandler updates the state with the new form data as the user types or selects.
  // It handles image files separately because they require a different way of accessing
  // the value (event.target.files) compared to other inputs.
  const changeHandler = (event) => {
    const name = event.target.name;
    if (name !== "images") {
      setForm({ ...form, [name]: event.target.value });
    } else {
      console.log(event.target.files);
      setForm({ ...form, [name]: event.target.files[0] });
    }
  };

  const addHandler = (event) => {
    // This prevents the default form submission behavior, which would cause a page reload.
    event.preventDefault();

    const formData = new FormData();
    // The FormData API is used here because the request includes a file (image).
    // This allows the data to be sent with the 'multipart/form-data' content type,
    // which is necessary for handling file uploads on the server-side.
    for (let i in form) {
      formData.append(i, form[i]);
      // The .append() method adds a new key/value pair to the FormData object.
    }

    // This retrieves the authentication token from the browser's cookies.
    // The token is needed for a secure request to the backend.
    const token = getCookie("accessToken");

    axios
      // This is a POST request to the API endpoint for creating a new post.
      .post(`${import.meta.env.VITE_BASE_URL}post/create`, formData, {
        headers: {
          // Setting the 'Content-Type' header to 'multipart/form-data' explicitly tells
          // the server that the request body contains form data, including files.
          "Content-Type": "multipart/form-data",
          // The Authorization header carries the bearer token for authentication.
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => toast.success(res.data.message))
      .catch((error) => toast.error("مشکلی پیش آمده است."));
  };

  return (
    // The form element uses a single onChange handler to capture all input changes.
    <form onChange={changeHandler} className={styles.form}>
      {/* This h3 element is currently empty. Consider adding a title here, 
        e.g., "Add New Post" to improve user experience.
      */}
      <h3></h3>
      <label htmlFor="title">عنوان</label>
      <input type="text" name="title" id="title" />
      <label htmlFor="content">توضیحات</label>
      <textarea name="content" id="content" />
      <label htmlFor="amount">قیمت</label>
      <input type="number" name="amount" id="amount" />
      <label htmlFor="city">شهر</label>
      <input type="text" name="city" id="city" />
      <label htmlFor="category">دسته بندی</label>
      <select name="category" id="category">
        {/* This is a conditional rendering of the dropdown options. 
          The 'data?.data' syntax is optional chaining, which ensures that
          the code doesn't crash if 'data' or 'data.data' is undefined.
          The '.map' method iterates over the fetched categories to create 
          an option for each one. The 'key' prop is essential for React to
          efficiently render lists.
        */}
        {data?.data.map((i) => (
          <option key={i._id} value={i._id}>
            {i.name}
          </option>
        ))}
      </select>
      <label htmlFor="images">عکس</label>
      <input type="file" name="images" />
      {/* The button uses an onClick handler to trigger the form submission.
        Note: It's often a good practice to use 'type="submit"' on the button
        and 'onSubmit' on the form, but this approach also works.
      */}
      <button onClick={addHandler}>ایجاد</button>
    </form>
  );
}

export default AddPost;
