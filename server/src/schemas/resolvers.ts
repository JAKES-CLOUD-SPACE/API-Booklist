import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface SaveBookArgs {
    input: {
        bookId: string;
        authors: string[];
        description?: string;
        title: string;
        image?: string;
        link?: string;
    }
}

interface LoginUserArgs {
    username: string;
    email: string;
    password: string;
}

export const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: any) => {
        if (context.user) {
            return await User.findOne({ _id: context.user._id });
        }

        throw new AuthenticationError('Authentication error.');
    }
},

  Mutation: {
    // Login mutation, authenticates a user and returns a token and user data
    login: async (_parent: unknown, { username, email, password }: LoginUserArgs) => {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
            throw new AuthenticationError("Can't find this user");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError('Wrong password!');
        }
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
    },

    // Add a new user and return token and user data
    addUser: async (_parent: unknown, { input }: AddUserArgs) => {
        const user = await User.create({ ...input });

        const token = signToken(user.username, user.email, user._id);

        return { token, user };
    },

    // Save a book to the user's savedBooks
    saveBook: async (_parent: unknown, { input }: SaveBookArgs, context: any) => {
        try {
            const updateUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
            );
            return updateUser;
        } catch (err) {
            console.log(err);
            throw new Error('error saving book');
        }
    },

    // Remove a book from the user's savedBooks
    deleteBook: async (_parent: unknown, { bookId }: { bookId: string }, context: any) => {
        const updateUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
        );

        if (!updateUser) {
            throw new Error('Could not find user with this id!');
        }

        return updateUser;
    }
}
};
