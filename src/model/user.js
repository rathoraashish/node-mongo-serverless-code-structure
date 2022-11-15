export default function User(mongoose){
    const user = mongoose.model(
        "user",
        mongoose.Schema(
            {
                name: String,
                age: Number,
                technology: String,
            },
            { timestamps: true }
        )
    );
    return user;
}
