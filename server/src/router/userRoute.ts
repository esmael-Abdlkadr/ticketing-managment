import express from "express";
const router = express.Router();
import {
  updateMe,
  deleteMe,
  myInfo,
  getAllUser,
  assignRoleToUser,
  getOrganizerUsers,
  inviteUser,
} from "../controllers/userController";
import { protect, restrictTo } from "../controllers/authController";
router.use(protect);
router.get("/me", myInfo);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);
// router.use(restrictTo("admin"));
router.get("/all", getAllUser);
router.patch("/:userId/assign-role", assignRoleToUser);
router.post("/invite-user", inviteUser);
router.get("/", getOrganizerUsers);
export default router;

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     tags: [User]
 *     summary: Get current user info
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *       401:
 *         description: User not authenticated
 */

/**
 * @swagger
 * /api/v1/users/update-me:
 *   patch:
 *     tags: [User]
 *     summary: Update current user info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: User not authenticated
 */

/**
 * @swagger
 * /api/v1/users/delete-me:
 *   delete:
 *     tags: [User]
 *     summary: Delete current user
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: User not authenticated
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [User]
 *     summary: Get all users (admin only)
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/v1/users/{userId}/assign-role:
 *   patch:
 *     tags: [User]
 *     summary: Assign role to user (admin only)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/v1/users/create-event-user:
 *   post:
 *     tags: [User]
 *     summary: Create a new event user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               eventId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               role:
 *                 type: string
 *                 example: attendee
 *     responses:
 *       201:
 *         description: Event user created successfully
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Not authorized to create event users
 *       500:
 *         description: Failed to create event user account
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [User]
 *     summary: Get users associated with the organizer's events
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Organizer not found
 */
