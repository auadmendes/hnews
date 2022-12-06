import { graphql } from 'graphql'
import { request, gql } from 'graphql-request'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

export const getPost = async () => {
  const query = gql`
  query Assets {
  postsConnection(where: {featuredPost: true}) {
    edges {
      node {
        title
        slug
        excerpt
        content {
          raw
          html
        }
        author {
          name
        }
        id
        createdAt
      }
    }
  }
}
  `
  const result = await request(graphqlAPI, query)
  
  return  result.postsConnection.edges

}

export const getPostBySlug = async (slug: string ) => {
  const pageSlug = slug
  
  const query = gql`
  query($pageSlug: String!) {
    postsConnection(where: {slug: $pageSlug}) {
    edges {
      node {
        title
        createdAt
        slug
        content {
          raw
          html

        }
        date
        author {
          name
        }
      }
    }
  }
}
  `
  const variables = {
    pageSlug,
  }
  const result = await request(graphqlAPI, query, variables )
  
  //console.log(result.postsConnection.edges)


  return  result.postsConnection.edges
}