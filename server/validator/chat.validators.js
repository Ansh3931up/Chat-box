// import express from "express";
import { body } from "express-validator";

const createAGroupChatValidator = () => {
    return [
        body("name").trim().notEmpty().withMessage("name is required"),
        body('participants').isArray({ min: 2, max: 100 })
            .withMessage("participants must be more than 2 and less than 100")
    ];
}

const updateGroupChatNameValidator = () => {
    return [
        body("name").trim().notEmpty().withMessage("name is required")
    ];
}

export { createAGroupChatValidator, updateGroupChatNameValidator };
