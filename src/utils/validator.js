export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    if (password.length < 6) {
        return {
            valid: false,
            message: "Password must be at least 6 characters long",
        };
    }
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            message: "Password mus contain uppercase letter",
        };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "password mut contain number" };
    }
    return { valid: true, message: "Password valid" };
};

export const validateUsername = (username) => {
    if (username.length < 3) {
        return {
            valid: false,
            message: "Username must be at least 3 characters",
        };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return {
            valid: false,
            message:
                "Username can only contain letters, numbers, dash, and underscore",
        };
    }
    return { valid: true, message: "Username valid" };
};
