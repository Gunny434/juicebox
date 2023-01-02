function requireUser(req, res, next) {
    if (!req.user) {
        next ({
            name: "MissingUserError",
            message: "You must be logged in to perform this action."
        });
    }
    console.log("requireUser successful. Moving to next step.")
    next();
}

module.exports = {
    requireUser
}