import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import "ress/dist/ress.min.css"
import "./layout.css"

export const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="sample" />
        <meta name="keywords" content="sample, something" />
      </Helmet>

      {children}
    </>
  )
}
