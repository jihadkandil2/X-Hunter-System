import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert2";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/auth/login", values);
      console.log(response);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);

      const isAdmin = values.email === "admin@gmail.com";
      localStorage.setItem("role", isAdmin ? "admin" : "user");

      swal.fire({
        icon: "success",
        title: `Welcome back, ${
          values.email.split("@")[0].charAt(0).toUpperCase() +
          values.email.split("@")[0].slice(1)
        }!`,
        text: "You have successfully logged in.",
        confirmButtonColor: "#1D3044",
      }).then(() => {
        // ✅ استخدم window.location.href بدل navigate فقط لتعمل reset كامل للـ state
        if (isAdmin) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/home";
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password",
        confirmButtonColor: "#1D3044",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay"></div>

      <div className="login-form">
        <h2>Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="form-group">
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
              />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <div className="remember-forgot">
              <div>
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe"> Remember me</label>
              </div>
            </div>

            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
          </Form>
        </Formik>

        <Link to="/forgot-password" className="forgot-password">
          Forgot password?
        </Link>

        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/register" className="text-decoration-none text-warning">
            Signup
          </Link>
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

export default Login;
