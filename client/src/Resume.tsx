import DocumentDisplay from './DocumentDisplay'; // Assuming the above component is saved in a file named DocumentDisplay.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { baseUrl } from './utils';

export default function Resume() {
  const location = useLocation();

  const { hash, pathname, search } = location;

  console.log({ hash, pathname, search })

  useEffect(() => {
    fetch(baseUrl + 'job/' + pathname.replace('/', '')).
      then(data => data.json()).
      then(st => {
        console.log({ st })
      })
  })

  return <DocumentDisplay
    resume="Your resume text here..."
    coverLetter="Your cover letter text here..."
  />

}
