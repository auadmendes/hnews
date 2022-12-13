import { request, gql } from 'graphql-request'

const graphqlAPI = 'https://api-sa-east-1.hygraph.com/v2/clb6moqk100ko01un684j9b9o/master' //process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

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


  return  result.postsConnection.edges
}