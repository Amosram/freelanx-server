import express from 'express'
import { addJobs, listJobs, removeJob, singleJob, getJobs, applyJob, getAppliedJobs,adminAplliedJobs,deleteApplication } from '../controllers/jobsController.js';
import authMiddleware from '../middleware/authMiddleware.js'

const jobsRouter = express.Router();

jobsRouter.post('/add', addJobs);
jobsRouter.get('/list', listJobs);
jobsRouter.get('/myJobs',authMiddleware, getJobs);
jobsRouter.delete('/remove/:id', removeJob);
jobsRouter.post('/job', singleJob);
jobsRouter.post('/job/:jobId/apply',authMiddleware, applyJob);
jobsRouter.delete('/application/:jobId/delete',authMiddleware, deleteApplication);
jobsRouter.get('/applied-jobs',authMiddleware, getAppliedJobs);
jobsRouter.get('/admin/all-applied-jobs', adminAplliedJobs);

export default jobsRouter;