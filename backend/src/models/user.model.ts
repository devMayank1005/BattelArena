import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    email: string;
    password?: string;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    }
}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

userSchema.methods.comparePassword = async function (password: string) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model<IUser>("User", userSchema)
export default userModel