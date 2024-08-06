import React from "react"
import PhotoCapture from "./components/MainPhotoCapture"
import NavBar from "./components/NavBar"

const Home: React.FC = () => {
  return (
    <>
      <NavBar />
      <PhotoCapture />
    </>
  )
}

export default Home
