import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    }
}, { timestamps: true });
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});
userSchema.methods.comparePassword = async function (password) {
    if (!this.password)
        return false;
    return await bcrypt.compare(password, this.password);
};
const userModel = mongoose.model("User", userSchema);
export default userModel;
