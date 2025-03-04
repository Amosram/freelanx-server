import jobModel from '../models/jobModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

//adding jobs functionality
const addJobs = async (req, res) => {

    try { 
        
        const {
            jobTitle,
            jobType,
            qualifications,
            experience,
            location,
            salary,
            jobDescription,
            responsibilities,
            deadline,
            category,
            requiredSkills,
        } = req.body;

        const newJob = new jobModel({
            jobTitle,
            jobType,
            qualifications,
            experience,
            location,
            salary:Number(salary),
            jobDescription,
            responsibilities,
            deadline,
            category,
            requiredSkills,
        })

        newJob.save();
        res.json({success:true, message:"Job Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//getting jobs functionality
const listJobs = async (req, res) => {
    try {
        const allJobs = await jobModel.find({})
        res.json({success:true,allJobs});
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//getting jobs functionality
const getJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const jobs = await jobModel.find({
            category:{$in: user.categories}
        })
        .sort({date: -1})
        .limit(50);

        // Calculate match score for each job
        const matchedJobs = jobs.map(job => {
            const skillMatchCount = job.requiredSkills.filter(skill => 
            user.skills.includes(skill)).length;
            const matchScore = (skillMatchCount / job.requiredSkills.length) * 100;
            
            return {
            ...job._doc,
            matchScore
            };
        });
    
        // Sort by match score
        matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

        res.json({success:true, matchedJobs})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//function for removing jobs
const removeJob = async (req, res) => {
    try {
        const {id} = req.params;
        await jobModel.findByIdAndDelete(id);     
        res.json({success:true,message:"Job deleted succeesifully"});
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//function displaying single job
const singleJob = async (req, res) => {
    try {
        const {jobId} = req.body;
        const job = await jobModel.findById(jobId);
        res.json({success:true,job});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
} 

//job application functionality
const applyJob = async (req, res) => {
    const {jobId} = req.params;
    const {
        firstName, 
        secondName,
        school,
        course,
        degree,
        city,
        zipcode,
        resume,
        street,
        gpa,
        message
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ msg: 'Invalid job ID format' });
      }

    try {
        const job = await jobModel.findById(jobId);
        if (!job) {
            res.json({success:false, message:"Job not fond!"});
        }

        const user = await User.findById(req.user.id);
        
        job.applications.push({
            userId: req.user.id,
            firstName,
            secondName,
            school,
            course,
            degree,
            city,
            zipcode,
            resume,
            street,
            gpa,
            message,
            status: 'pending'
        })

        await job.save();
        res.json({succcess:true, message:"Application Submitted"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

//fetching the applied jobs
const getAppliedJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find({'applications.userId': req.user.id});
        const appliedJobs = jobs.map(job => {
            const userApplication = job.applications.find(app => 
                app.userId.toString() === req.user.id.toString()
            );
            return {
                title: job.jobTitle,
                application:{
                    status:userApplication.status
                },
                date:job.date
            };
        });
        res.json(appliedJobs);
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

const adminAplliedJobs = async (req, res) => {
    try {
      const jobs = await jobModel.find({ 'applications.0': { $exists: true } }) // Only jobs with applications
        .populate('applications.userId', 'username email'); // Populate user details
  
      const appliedJobs = jobs.map(job => ({
        _id: job._id,
        title: job.jobTitle,
        category: job.category,
        requiredSkills: job.requiredSkills,
        date: job.date,
        applications: job.applications.map(app => ({
          userId: app.userId._id,
          email: app.userId.email,
          firstName: app.firstName,
          secondName: app.secondName,
          city: app.city,
          street: app.street,
          zipcode: app.zipcode,
          resume: app.resume,
          message: app.message,
          status: app.status
        }))
      }));
  
      res.json(appliedJobs);
    } catch (err) {
      console.error('All applied jobs fetch error:', err.message);
      res.status(500).json({ msg: 'Server error' });
    }
};

//cancelling job application
const deleteApplication = async (req, res) => {
    const {jobId} = req.params;
    try {
        const job = await jobModel.findById(jobId);
        if (!job) {
          return res.status(404).json({ msg: 'Job not found' });
        }
    
        const applicationIndex = job.applications.findIndex(app => 
          app.userId.toString() === req.user.id.toString()
        );
    
        if (applicationIndex === -1) {
          return res.status(404).json({ msg: 'Application not found' });
        }
    
        job.applications.splice(applicationIndex, 1); // Remove the application
        await job.save();
    
        res.json({ msg: 'Application deleted successfully' });
      } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
      }
 };

export {
    addJobs,
    listJobs,
    removeJob,
    singleJob,
    getJobs,
    applyJob,
    getAppliedJobs,
    adminAplliedJobs,
    deleteApplication
}