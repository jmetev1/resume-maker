import { useQuery } from "react-query";
import { baseUrl } from "./utils"
import { Link } from "react-router-dom"

const jobStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '5px',
  padding: '20px',
  margin: '10px 0',
  boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)'
};
export type Job = {
  _id: string,
  myUrl: string,
  jdUrl: string,
  jobDescription: string
}
export default function AllLinks() {
  const queryFn = (): Promise<Job[]> => {
    const url = baseUrl + 'jobs'
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json().then(data => data)
    })
  }
  const { isLoading, error, data } = useQuery('jobs', queryFn)

  const deleteJob = async (id) => {
    const response = await fetch(baseUrl + 'job/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }
  if (error) return <div>error</div>

  return (
    isLoading ? <div>loading</div> :
      <div>
        {data.map((job) => {
          return (
            <div style={jobStyle} key={job._id}>
              <div> <Link to={`../${job.myUrl}`}>resume link</Link></div>
              <div>  <a href={job.jdUrl} >Original Post</a>  </div>
              <div>Description:{job.jobDescription.slice(0, 200)} </div>
              <button onClick={() => deleteJob(job._id)}>delete</button>
            </div>
          )
        })}
      </div>
  )
}
