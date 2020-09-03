import * as React from "react"
import { graphql } from "gatsby"
import { Layout } from "../components"

const IndexPage = props => {
  const {
    data: {
      work: { edges: work },
    },
  } = props

  return (
    <Layout>
      <h2>Work</h2>
      {work.map(({ node: set }) => (
        <div
          key={set.id}
          style={{ border: "1px solid white", padding: 10, marginBottom: 10 }}
        >
          <div style={{ display: "flex" }}>
            {set.frontmatter.gallery_images.map(image => (
              <img src={image.childImageSharp.fixed.src} />
            ))}
          </div>
        </div>
      ))}
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query IndexQuery {
    work: allMarkdownRemark(filter: { fields: { slug: { regex: "/work/" } } }) {
      edges {
        node {
          id
          frontmatter {
            gallery_images {
              childImageSharp {
                fixed(width: 100) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
  }
`
