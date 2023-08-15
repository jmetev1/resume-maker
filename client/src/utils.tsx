import { useQuery } from "react-query"

export const baseUrl = import.meta.env.PROD ?
  'https://hammerhead-app-ni8cb.ondigitalocean.app/'
  : 'http://localhost:3000/api/'

export const useData = (path, queryFn?) => {
  const defaultQueryFn = async () => {
    const url = baseUrl + path
    // console.log({ url })
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }
  return useQuery(path, queryFn || defaultQueryFn)
}

export const realJob = `Who we are        Violet Labs is building cloud-based software integration and data management for complex hardware engineering teams.                Our team has experience building spacecraft, drones and self-driving cars for companies like Google, DARPA, Lyft and Amazon. Now, we are developing the software platform that will revolutionize how these products are engineered.                Violet is backed by Space Capital, MaC Venture Capital, Felicis and other forward-thinking technologists and investors. We are a fast-growing startup seeking foundational engineers who can help us grow not only our product and tech stack, but our vision and our culture.                The ideal candidate is passionate about building reliable and delightful software, and wants to help radically improve and empower engineering teams by connecting the software tools that drive them.                What you’ll do        Help build integrations with software tools used across the hardware engineering lifecycle, such as requirements management, modeling and simulation, product lifecycle management, project management, operations and purchasing                Own the maintenance, testing, sample data and documentation for these software tools                Establish and maintain an understanding of how various software tools are used in hardware workflows, and act as a resource for the broader engineering team                Engage frequently with customers and users, translate feature requests and bugs into actionable tasks                Partner with our engineering team to deliver high-quality code                Help define and grow our engineering culture, processes and tools                You should have        Some experience in or knowledge of hardware development workflows                Some proficiency with modern technologies like React, NextJS, TypeScript/Node.JS, NestJS, TypeORM Postgres and RESTful APIs                Self-starter, able to navigate ambiguity and rapidly evolving priorities                Team player with great communication skills and collaborative work ethic                Bonus points        Technical background and industry experience in production software engineering                Experience in hardware programs such as spacecraft, launch vehicles, aircraft, robotics, consumer or medical devices                Experience in fast-growing tech startups                Experience building products or implementing systems that comply with International Traffic in Arms Regulations (ITAR) and The Export Administration Regulations (EAR)                Benefits        100% virtual work with flexible hours                Unlimited paid time off                Quarterly team off-sites                Competitive salary and equity with top tier benefits                401k retirement plan                Health insurance: Medical, Vision, Denta`