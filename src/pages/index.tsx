import * as React from "react"
import { useRef, useState } from "react"
import { graphql } from "gatsby"
import { HTML } from "drei"
import { Block, Three, Layout } from "../components"
import { useFrame, useLoader } from "react-three-fiber"
import * as THREE from "three"

export function Box(props: any) {
  const mesh = useRef()
  // @ts-ignore
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
  return (
    <mesh {...props} ref={mesh} scale={[1, 1, 1]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={"orange"} />
    </mesh>
  )
}

const Image = () => {
  const mesh = useRef<any>()
  const texture = useLoader(THREE.TextureLoader, "/art.png")
  useFrame(() => (mesh.current.rotation.y += 0.004))
  return (
    <mesh ref={mesh}>
      <meshBasicMaterial
        side={THREE.DoubleSide}
        map={texture}
        attach="material"
      />
      <planeBufferGeometry attach="geometry" args={[16, 24, 128, 128]} />
    </mesh>
  )
}

function ContentBlock() {
  const [test, setTest] = useState(false)

  return (
    <Block
      three={({ viewport }) => (
        <>
          <HTML>this bit of html in controlled via r3f</HTML>
          {test && <Box position={[1.5, viewport.height * 0.33, 0]} />}
          <Box position={[0, viewport.height * 0.33, 0]} />
          <Box position={[-1.5, viewport.height * 0.33, 0]} />
        </>
      )}
    >
      <h4>Test</h4>
      Test hello this is normal dom, sharing scoped component state with r3f
      <button onClick={() => setTest(!test)}>toggle box</button>
    </Block>
  )
}

const IndexPage = props => {
  const {
    data: {
      // story: { frontmatter: story },
      // contact: { frontmatter: contact },
      work: { edges: work },
      // press: { edges: press },
    },
  } = props

  return (
    <Layout>
      <h1>Content Data Page</h1>
      <p>Non-styled page for viewing all site content</p>
      {/* 
      <h2>Story</h2>
      <p>{story.intro}</p>
      <p>{story.body}</p>

      <h2>Contact</h2>
      <p>{contact.email}</p>
      <p>{contact.instagram}</p>
      <div style={{ display: "flex" }}>
        {contact.instagram_posts.map(image => (
          <img src={image.childImageSharp.fixed.src} />
        ))}
      </div> */}

      <h2>Work</h2>
      {work.map(({ node: set }) => (
        <div
          key={set.id}
          style={{ border: "1px solid white", padding: 10, marginBottom: 10 }}
        >
          {/* <h3>{set.frontmatter.title}</h3>

          <p>{set.frontmatter.description}</p> */}
          <div style={{ display: "flex" }}>
            {set.frontmatter.gallery_images.map(image => (
              <img src={image.childImageSharp.fixed.src} />
            ))}
          </div>
        </div>
      ))}

      {/* <h2>Press</h2>
      {press.map(({ node: article }) => (
        <div
          key={article.id}
          style={{ border: "1px solid white", padding: 10, marginBottom: 10 }}
        >
          <h3>{article.frontmatter.title}</h3>
          <p>{article.frontmatter.description}</p>

          <a href={article.frontmatter.link} target="_blank">
            {article.frontmatter.link}
          </a>
          <div style={{ display: "flex" }}>
            <img src={article.frontmatter.image.childImageSharp.fixed.src} />
          </div>
        </div>
      ))} */}
      {/* <ContentBlock /> */}
      <Three />
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

// export const query = graphql`
//   query Index {
//     story: markdownRemark(fields: { slug: { regex: "/story/" } }) {
//       frontmatter {
//         intro
//         body
//       }
//     }
//     contact: markdownRemark(fields: { slug: { regex: "/contact/" } }) {
//       frontmatter {
//         email
//         instagram
//         instagram_posts {
//           childImageSharp {
//             fixed(width: 200) {
//               src
//               width
//             }
//           }
//         }
//       }
//     }
//     work: allMarkdownRemark(filter: { fields: { slug: { regex: "/work/" } } }) {
//       edges {
//         node {
//           id
//           frontmatter {
//             title
//             description
//             gallery_images {
//               childImageSharp {
//                 fixed(width: 200) {
//                   src
//                   width
//                 }
//               }
//             }
//           }
//           fields {
//             slug
//           }
//         }
//       }
//     }
//     press: allMarkdownRemark(
//       filter: { fields: { slug: { regex: "/press/" } } }
//     ) {
//       edges {
//         node {
//           id
//           frontmatter {
//             title
//             link
//             description
//             image {
//               childImageSharp {
//                 fixed(width: 200) {
//                   src
//                   width
//                 }
//               }
//             }
//           }
//           fields {
//             slug
//           }
//         }
//       }
//     }
//   }
// `
