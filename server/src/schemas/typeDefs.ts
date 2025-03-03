
export const typeDefs = `
  # User type with required fields
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]
  }

  # Book type, representing the structure of a saved book
  type Book {
    bookId: String!
    authors: [String!]!
    description: String
    title: String!
    image: String
    link: String
  }

  # Auth type for returning token and user data
  type Auth {
    token: String!
    user: User!
  }

  # Input type to handle parameters for saving a book
  input BookInput {
    bookId: String!
    authors: [String!]!
    description: String
    title: String!
    image: String
    link: String
  }
    
  # Input type to handle parameters for user login
  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  # Query type
  type Query {
    me: User
  }

  # Mutation type
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    deleteBook(bookId: String!): User
  }
`;
