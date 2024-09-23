const { z } = require('zod');

handleZodValidation = (req, res, next) => {
    const requiredZodBody = z.object({
        email: z.string().max(25).email(),
        password: z.string().min(6).refine((password) => /[A-Z]/.test(password), { message: "Password must contains atleast one UPPERCASE character" }).refine((password) => /[a-z]/.test(password), { message: "Password must contains atleast one lowercase character" }).refine((password) => /[0-9]/.test(password), { message: "Password must contains atleast one number" }).refine((password) => /[!@#$%^&*]/.test(password), { message: "Password must contain atleast one special character" }),
        first_name: z.string().min(3).max(25)
    })

    const parsedUserInput = requiredZodBody.safeParse(req.body);

    if (!parsedUserInput.success) {
        return res.status(400).json({ message: "Please enter correct details", error: parsedUserInput.error.issues[0].message })
    }

    next();
}

module.exports = handleZodValidation;