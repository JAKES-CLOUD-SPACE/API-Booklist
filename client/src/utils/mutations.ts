import { gql } from '@apollo/client';

// Mutation to save a book for the logged-in user
export const SAVE_BOOK = gql`
mutation SaveBook($input: BookInput!) {
    saveBook(input: $input) {
        _id
        username
        email
        bookCount
        savedBooks {
            authors
            bookId
            description
            image
            link
            title
        }
    }
}
`;

// Mutation to remove a saved book from the user's list
export const REMOVE_BOOK = gql`
mutation DeleteBook($bookId: String!) {
    deleteBook(bookId: $bookId) {
        _id
        username
        email
        bookCount
        savedBooks {
            authors
            bookId
            description
            image
            link
            title
        }
    }
}
`;

// Mutation for user signup
export const ADD_USER = gql`
mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
        user {
            _id
            username
            email
            bookCount
            savedBooks {
                authors
                bookId
                description
                image
                link
                title
            }
        }
    token
    }
}
`;

// Mutation for user login
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
