import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert2";
import "../Register/Register.css"; 

function EditLabs() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [labData, setLabData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/labs/getById/${id}`);
        console.log(response.data);
        setLabData(response.data.lab);
      } catch (error) {
        console.error("Error fetching lab data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabData();
  }, [id]);

  const validationSchema = Yup.object({
    vulnerabilityName: Yup.string().required("Vulnerability Name is required"),
    labDescription: Yup.string().required("Description is required"),
    labScenario: Yup.string().required("Scenario is required"),
    labLevel: Yup.string().required("Level is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(`http://localhost:3000/labs/${id}`, values);
      swal.fire({
        icon: "success",
        title: "Lab Updated",
        text: "The lab has been successfully updated.",
        confirmButtonColor: "#1D3044",
      });
      navigate("/manage-labs");
    } catch (error) {
      console.error("Update error:", error);
      swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating. Please try again.",
        confirmButtonColor: "#1D3044",
      });
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    <div className="register-container">
      <div className="register-overlay"></div>
      <div className="register-form">
        <h2>Edit Lab</h2>

        {isLoading ? (
          <p className="loading-message">Loading lab data...</p>
        ) : (
          <Formik
            enableReinitialize
            initialValues={labData || {
              vulnerabilityName: "",
              labDescription: "",
              labScenario: "",
              labLevel: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => ( 
              <Form>
                <div className="form-group">
                  <Field type="text" name="vulnerabilityName" placeholder="Vulnerability Name" className="register-input" />
                  <ErrorMessage name="vulnerabilityName" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <Field type="text" name="labDescription" placeholder="Description" className="register-input" />
                  <ErrorMessage name="labDescription" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <Field type="text" name="labScenario" placeholder="Scenario" className="register-input" />
                  <ErrorMessage name="labScenario" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <Field type="text" name="labLevel" placeholder="Level" className="register-input" />
                  <ErrorMessage name="labLevel" component="div" className="error-message" />
                </div>

                <button type="submit" className="register-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Loading..." : "Update Lab"} 
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default EditLabs;
