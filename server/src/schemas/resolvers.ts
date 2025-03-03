import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';
// defining types for the arguments
interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    username: string;
    email: string;
    password: string;
}

interface SaveBookArgs {
    input: {
        authors: string[];
        description: string;
        bookId: string;
        image: string;
        link: string;
        title: string;
    }
}

export const resolvers = {
     // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    Query: {
        me: async (_parent: any, _args: unknown, context: any) => {
            // If the user is authenticated, find and return the user's information
            if (context.user) {
                return await User.findOne({ _id: context.user._id });
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Authentication error.');
            }
        },
    Mutation: {
        login: async (_parent: any, { username, email, password }: LoginUserArgs) => {
            // Find user by username or email
            const user = await User.findOne({ 
                $or: [{ username }, { email }]
             });
             // If no user is found, throw an AuthenticationError

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }
      // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        addUser: async (_parent: any, { input }: AddUserArgs) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
          
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
          
            // Return the token and the user
            return { token, user };
          },


        saveBook: async (_parent: any, { input }: SaveBookArgs, context: any) => {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );

                if (!updatedUser) {
                    throw new Error('Could not find user with this id!');
                }

                return updatedUser;
            },
        

        deleteBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error('Could not find user with this id!');
            }

            return updatedUser;
        }
    }
}

