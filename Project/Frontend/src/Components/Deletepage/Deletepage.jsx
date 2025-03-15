import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "../Register/Register.css"; 

function DeleteAccount() {
  const navigate = useNavigate();
  const MySwal = withReactContent(swal);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Retrieve token and userId from localStorage (adjust keys as needed)
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  console.log(userId);
  
  const initialValues = {
    oldPassword: "",
   
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old Password is required"),

  });

  const onSubmit = async (values) => {
    try {
 
      const response = await axios.delete(`http://localhost:3000/user/profile/delete/${userId}`, {
        data: {
          oldPassword: values.oldPassword,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setDeleteSuccess(true);
      MySwal.fire({
        icon: "success",
        title: "Account Deleted!",
        text: "Your account has been successfully deleted.",
        confirmButtonText: "OK",
        confirmButtonColor: "#1D3044",
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          // Clear stored credentials
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Delete error:", error);
      MySwal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Failed to delete account. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#1D3044",
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-overlay"></div>
      <div className="register-form">
        <h2>Delete Account</h2>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="form-group">
              <Field
                type="password"
                name="oldPassword"
                placeholder="Password"
                className="register-input"
                required
              />
              <ErrorMessage name="oldPassword" component="div" className="error-message" />
            </div>

            <button type="submit" className="register-btn">
              Delete 
            </button>
          </Form>
        </Formik>
        {deleteSuccess && (
          <div className="alert alert-success mt-3" role="alert">
            Account deleted successfully!
          </div>
        )}
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

export default DeleteAccount;