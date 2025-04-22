import express from 'express';
import authenticateUser from '../middleware/auth.js';
import { authorizeUser } from '../middleware/authorizeUser.js';

import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/:userId', authenticateUser, authorizeUser, getProfile);
router.put('/:userId', authenticateUser, authorizeUser, updateProfile);

router.post('/:userId/address', authenticateUser, authorizeUser, addAddress);
router.patch('/:userId/address/:addressId', authenticateUser, authorizeUser, updateAddress);
router.delete('/:userId/address/:addressId', authenticateUser, authorizeUser, deleteAddress);
router.patch('/:userId/address/:addressId/default', authenticateUser, authorizeUser, setDefaultAddress);


export default router; 