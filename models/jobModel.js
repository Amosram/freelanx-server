import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    qualifications: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    responsibilities: {
        type: [String],
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    date: {
        type:Date,
        default:Date.now
    },
    category: String,
    requiredSkills: [String],
    applications: [{ 
        userId: {type:mongoose.Schema.Types.ObjectId, ref:'User'}, 
        firstName: String,
        secondName: String,
        school: String,
        course: String,
        degree: String,
        city: String,
        street: String,
        zipcode: String,
        gpa: String,
        resume: String, 
        message: String,
        status: { type: String, default: 'pending' }
      }],
})

const jobModel = mongoose.models.job || mongoose.model("job", jobSchema)

export default jobModel