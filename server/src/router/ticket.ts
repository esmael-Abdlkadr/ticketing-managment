import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment,
  getTicketStats,
  getActiveUsers,
} from "../controllers/ticketContoller";
import { protect } from "../controllers/authController";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/stats", protect, getTicketStats);
router.get("/active-users", protect, getActiveUsers);
router.get("/:id", protect, getTicketById);
router.patch("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);
router.post("/:id/comments", protect, addComment);

export default router;

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management
 */

/**
 * @swagger
 * /api/v1/tickets:
 *   post:
 *     tags: [Tickets]
 *     summary: Create a new ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/tickets:
 *   get:
 *     tags: [Tickets]
 *     summary: Get all tickets
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 */

/**
 * @swagger
 * /api/v1/tickets/stats:
 *   get:
 *     tags: [Tickets]
 *     summary: Get ticket statistics
 *     responses:
 *       200:
 *         description: Ticket statistics retrieved successfully
 *       403:
 *         description: Not authorized to access ticket statistics
 */

/**
 * @swagger
 * /api/v1/tickets/active-users:
 *   get:
 *     tags: [Tickets]
 *     summary: Get active users
 *     responses:
 *       200:
 *         description: Active users retrieved successfully
 *       403:
 *         description: Not authorized to access this information
 */

/**
 * @swagger
 * /api/v1/tickets/{id}:
 *   get:
 *     tags: [Tickets]
 *     summary: Get ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *       404:
 *         description: Ticket not found
 */

/**
 * @swagger
 * /api/v1/tickets/{id}:
 *   patch:
 *     tags: [Tickets]
 *     summary: Update ticket
 *     parameters:
 *       - in: path
 *         name: id
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Ticket not found
 */

/**
 * @swagger
 * /api/v1/tickets/{id}:
 *   delete:
 *     tags: [Tickets]
 *     summary: Delete ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       403:
 *         description: Not authorized to delete this ticket
 *       404:
 *         description: Ticket not found
 */

/**
 * @swagger
 * /api/v1/tickets/{id}/comments:
 *   post:
 *     tags: [Tickets]
 *     summary: Add comment to ticket
 *     parameters:
 *       - in: path
 *         name: id
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
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Ticket not found
 */
