import axios from "axios";
import { models } from "./models";
import { resume, testJob, first, second, third } from './test-job';
const { JobModel } = models;

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getKey = () => `${getRandom(first)}-${getRandom(second)}-${getRandom(third)}`

export const getJobs = () => JobModel.find();

export const getJob = async (myUrl) => JobModel.findOne({ myUrl })
// func to delete job
export const deleteJob = async (id) => JobModel.deleteOne({ _id: id })

export const createJob = async (req, res, _next) => {
  const { jobDescription, jdUrl, } = req.body;
  // console.log({ jobDescription, jdUrl, })
  const url = 'https://api.openai.com/v1/chat/completions'
  const stuff = {
    max_tokens: 400,
    temperature: 0.9,
    top_p: 1,
    "model": "gpt-3.5-turbo",
    "messages": [
      ...[
        "here's my resume:",
        resume,
        "here's the job description:",
        jobDescription,
        "now write me a cover letter for this job. please make it about 100 words long and emphasize the skills from my resume that apply to the job description. Do not put a skill in the letter if it does not appear in my resume. It should start with `Hello team` followed by company name"
      ].map((content) => ({ role: "user", content }))
    ],
  }
  try {
    const { data } = await axios.post(url, stuff, { headers: { Authorization: `Bearer ${process.env.OPENAI_API}` } })
    data.choices.forEach((choice) => {
      console.log(choice)
    })
    const result = await JobModel.create({
      jobDescription,
      jdUrl,
      myUrl: getKey()
    });
    console.log({ result })
    res.json(result);
  }
  catch (e) {
    console.log(e)
  }
}
const autoCreate = () => {
  setTimeout(() => {
    createJob({
      body: {
        jobDescription: testJob.replace(/\n/g, " "),
        jdUrl: 'https://www.cocacola.com'
      }
    }
      , {}, {})
  }, 2000)
}
// autoCreate()