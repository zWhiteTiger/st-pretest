import mongoose, { Schema } from "mongoose";

const RatingSchema = new Schema(
    {
        code: {
            type: String,
            enum: ["G", "PG", "M", "MA", "R"],
            required: true,
        },

    },
    {
        _id: false,
    }
);

const MovieSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },

        slug: {
            type: String,
            required: true,
        },

        movieDescription: {
            type: String,
            required: true,
        },

        movieRelease: {
            type: Date
        },

        posterUrl: {
            type: String,
            required: true,
        },

        bannerUrl: {
            type: String,
        },

        tags: [
            {
                type: String,
            },
        ],

        rating: [RatingSchema],

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);