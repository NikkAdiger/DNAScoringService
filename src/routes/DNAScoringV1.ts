import express from 'express';
import * as DNAScoringController from '../controllers/DNAScoringController';

const router = express.Router();

// routes for 'api/v1/dna'
router.post('/check', DNAScoringController.checkDNA);

export default router;