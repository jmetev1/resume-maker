import { Pane, TextInputField, Textarea } from 'evergreen-ui';
import { Field, Formik } from 'formik';

export const Create = () => {

  const submit = async (values
    // , setSubmitting
  ) => {
    try {
      console.log({ values })
      const response = await fetch('http://localhost:3000/api/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      const data = await response.json()
      console.log(data)
      const { myUrl } = data
      const url = new URL("../" + myUrl, window.location.href);
      console.log({ url, myUrl })
      // window.location.href = url.href;
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {/* <Header user={username} /> */}
      <Pane
        paddingTop={15}
        paddingBottom={100}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Pane width="90vw" border="default">

          <Formik
            initialValues={{ jobDescription: '', jdUrl: '' }}
            // validate={values => ({})}
            onSubmit={submit}
          >
            {({
              values,
              // errors,
              // touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Pane display="flex" padding={6} background="tint2" borderRadius={3}>
                <Pane flex={1} alignItems="center">

                  <form onSubmit={handleSubmit}>
                    <Field
                      as={TextInputField}
                      name="jdUrl"
                      label="Job Description URL"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.jdUrl}
                    />
                    {/* {errors.email && touched.email && errors.email} */}
                    <Field
                      // type="password"
                      name="jobDescription"
                      label="Job Description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.jobDescription}
                      as={Textarea} />
                    {/* {errors.password && touched.password && errors.password} */}
                    <button type="submit" disabled={isSubmitting} id='submit-job'>
                      Submit
                    </button>
                  </form>
                </Pane>
              </Pane>
            )}
          </Formik>
        </Pane>
      </Pane>
    </>
  );
}


export default Create
