import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert2";
import "./register.css";

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmationPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z].*/, "Username must start with a letter")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmationPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { name, email, password, confirmationPassword } = values;
      const response = await axios.post("http://localhost:3000/auth/signup", {
        name,
        email,
        password,
        confirmationPassword,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/generate-labs");
      swal.fire({
        icon: "success",
        title: `Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
        text: "You have successfully registered.",
        confirmButtonColor: "#1D3044",
      });
    } catch (error) {
      console.error("Registration error:", error);
      swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "An error occurred while registering. Please try again.",
        confirmButtonColor: "#1D3044",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-overlay"></div>
      <div className="register-form">
        <h2>Signup</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="form-group">
              <Field
                type="text"
                name="name"
                placeholder="Username"
                className="register-input"
                required
              />
              <ErrorMessage
                name="name"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="register-input"
                required
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="register-input"
                required
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <Field
                type="password"
                name="confirmationPassword"
                placeholder="Confirm Password"
                className="register-input"
                required
              />
              <ErrorMessage
                name="confirmationPassword"
                component="div"
                className="error-message"
              />
            </div>
            <button type="submit" className="register-btn" disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </button>
          </Form>
        </Formik>
        <p className="signup-text">
          Already Registered? <Link to="/login">Login</Link>
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

export default Register;
