"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Reaction_1 = __importDefault(require("../models/Reaction"));
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Story_1 = __importDefault(require("../models/Story"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const validTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'fire'];
router.post('/post/:postId', auth_1.protect, async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        const { type } = req.body;
        if (!type || !validTypes.includes(type))
            return res.status(400).json({ success: false, message: `Type must be one of: ${validTypes.join(', ')}` });
        const post = await Post_1.default.findByPk(postId);
        if (!post)
            return res.status(404).json({ success: false, message: 'Post not found' });
        const existing = await Reaction_1.default.findOne({ where: { postId, userId: req.user.id } });
        if (existing) {
            if (existing.type === type) {
                await existing.destroy();
                return res.json({ success: true, active: false, data: null, message: 'Reaction removed' });
            }
            await existing.update({ type });
            return res.json({ success: true, active: true, data: existing });
        }
        const reaction = await Reaction_1.default.create({ postId, userId: req.user.id, type });
        res.status(201).json({ success: true, active: true, data: reaction });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ success: false, message });
    }
});
router.post('/comment/:commentId', auth_1.protect, async (req, res) => {
    try {
        const commentId = parseInt(req.params.commentId);
        const { type } = req.body;
        if (!type || !validTypes.includes(type))
            return res.status(400).json({ success: false, message: `Type must be one of: ${validTypes.join(', ')}` });
        const comment = await Comment_1.default.findByPk(commentId);
        if (!comment)
            return res.status(404).json({ success: false, message: 'Comment not found' });
        const existing = await Reaction_1.default.findOne({ where: { commentId, userId: req.user.id } });
        if (existing) {
            if (existing.type === type) {
                await existing.destroy();
                return res.json({ success: true, active: false, data: null, message: 'Reaction removed' });
            }
            await existing.update({ type });
            return res.json({ success: true, active: true, data: existing });
        }
        const reaction = await Reaction_1.default.create({ commentId, userId: req.user.id, type });
        res.status(201).json({ success: true, active: true, data: reaction });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ success: false, message });
    }
});
router.post('/story/:storyId', auth_1.protect, async (req, res) => {
    try {
        const storyId = parseInt(req.params.storyId);
        const { type } = req.body;
        if (!type || !validTypes.includes(type))
            return res.status(400).json({ success: false, message: `Type must be one of: ${validTypes.join(', ')}` });
        const story = await Story_1.default.findByPk(storyId);
        if (!story)
            return res.status(404).json({ success: false, message: 'Story not found' });
        const existing = await Reaction_1.default.findOne({ where: { storyId, userId: req.user.id } });
        if (existing) {
            if (existing.type === type) {
                await existing.destroy();
                return res.json({ success: true, active: false, data: null, message: 'Reaction removed' });
            }
            await existing.update({ type });
            return res.json({ success: true, active: true, data: existing });
        }
        const reaction = await Reaction_1.default.create({ storyId, userId: req.user.id, type });
        res.status(201).json({ success: true, active: true, data: reaction });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ success: false, message });
    }
});
router.get('/post/:postId', auth_1.protect, async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        const reactions = await Reaction_1.default.findAll({
            where: { postId },
            include: [
                { association: 'user', attributes: ['id', 'username', 'profilePicture'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json({ success: true, data: reactions });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ success: false, message });
    }
});
router.get('/story/:storyId', auth_1.protect, async (req, res) => {
    try {
        const storyId = parseInt(req.params.storyId);
        const reactions = await Reaction_1.default.findAll({
            where: { storyId },
            include: [
                { association: 'user', attributes: ['id', 'username', 'profilePicture'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json({ success: true, data: reactions });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ success: false, message });
    }
});
exports.default = router;
//# sourceMappingURL=reactions.js.map