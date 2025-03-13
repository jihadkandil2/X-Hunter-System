import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert2";
import "../Register/Register.css"; // Reuse the same design

function UpdateAccount() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "" });

  // Fetch current user data (adjust the endpoint as needed)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/user");
        setUserData({
          name: response.data.name,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const initialValues = {
    name: userData.name,
    email: userData.email,
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z].*/, "Username must start with a letter")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    oldpassword: Yup.string().required("Old password is required"),
    newpassword: Yup.string()
      .min(6, "New password must be at least 6 characters")
      .required("New password is required"),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("newpassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = async (values) => {
    try {
      const { name, email, oldpassword, newpassword, confirmpassword } = values;
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/auth/update",
        {
          name,
          email,
          oldpassword,
          newpassword,
          confirmpassword,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      navigate("/home");
      swal.fire({
        icon: "success",
        title: `Account Updated`,
        text: "Your account information has been successfully updated.",
      });
    } catch (error) {
      console.error("Update error:", error);
      swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating. Please try again.",
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-overlay"></div>
      <div className="register-form">
        <h2>Update Account</h2>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            {/* Name Field */}
            <div className="form-group">
              <Field
                type="text"
                name="name"
                placeholder="Username"
                className="register-input"
                required
              />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="register-input"
                required
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            {/* Old Password Field */}
            <div className="form-group">
              <Field
                type="password"
                name="oldpassword"
                placeholder="Old Password"
                className="register-input"
                required
              />
              <ErrorMessage name="oldpassword" component="div" className="error-message" />
            </div>

            {/* New Password Field */}
            <div className="form-group">
              <Field
                type="password"
                name="newpassword"
                placeholder="New Password"
                className="register-input"
                required
              />
              <ErrorMessage name="newpassword" component="div" className="error-message" />
            </div>

            {/* Confirm New Password Field */}
            <div className="form-group">
              <Field
                type="password"
                name="confirmpassword"
                placeholder="Confirm New Password"
                className="register-input"
                required
              />
              <ErrorMessage name="confirmpassword" component="div" className="error-message" />
            </div>

            <button type="submit" className="register-btn">
              Update
            </button>
          </Form>
        </Formik>
        <p className="signup-text">
          <Link to="/home">Back to Home</Link>
        </p>
        <div className="links-footer">
          <Link to="#">Terms & Conditions</Link>
          <Link to="#">Support</Link>
          <Link to="#">Customer Care</Link>
        </div>
      </div>
    </div>
  );
}

export default UpdateAccount;
