export const typeDefs = `#graphql
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    input BookInput {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Query {
        me: User
    }

    type Mutation {
        createUser(input: UserInput!): Auth
        login(username: String, email: String, password: String!): Auth
        saveBook(input: BookInput!): User
        deleteBook(bookId: String!): User
    }
`;
