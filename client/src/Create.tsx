import { Pane, TextInputField, Textarea } from 'evergreen-ui';
import { Field, Formik } from 'formik';
import { baseUrl, realJob } from './utils';
import { useReducer } from 'react';
// import { render } from './pdf-maker';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const Create = () => {

  const [state, dispatch] = useReducer(reducer, { coverLetter: '' })
  const { coverLetter } = state
  const submit = async (values
  ) => {
    try {
      const response = await fetch(baseUrl + 'generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      const data = await response.json()
      console.log('made it', data)
      const { myUrl, coverLetter } = data
      dispatch({ type: 'update', payload: { coverLetter } })
      // const url = new URL("../" + myUrl, window.location.href);
      // window.location.href = url.href;
    }
    catch (error) {
      console.log(error)
    }
  }
  const devInitalValues = {
    jobDescription: realJob,
    jdUrl: 'http://jobs.polymer.co/violet-labs/28087'
  }
  return (
    <>
      <a href={baseUrl + "generate-resume"} > Download File</a >

      <Textarea name="cover letter" value={coverLetter} />
      <Pane
        paddingTop={15}
        paddingBottom={100}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Pane width="90vw" border="default">

          <Formik
            initialValues={import.meta.env.PROD ? { jobDescription: '', jdUrl: '' } : devInitalValues}
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
