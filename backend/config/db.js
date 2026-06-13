import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://akul:akul1234.@cluster0.hvue57u.mongodb.net/Expense")
        .then(() => console.log("DB connected"));
}