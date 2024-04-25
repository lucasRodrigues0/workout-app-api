import mongoose from "mongoose";

main().catch(err => console.log(err));

export async function main() {
  await mongoose.connect('mongodb+srv://lucasrodrigues:dLD35okgn6gZw4lF@cluster0.cwxx3ek.mongodb.net/workout-app');
  console.log('connected');
}