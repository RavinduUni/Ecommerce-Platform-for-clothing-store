export const adminLogin = (req, res) => {
    // Logic for admin login


    res.status(200).json({ message: "Admin logged in successfully" });
}

export const adminLogout = (req, res) => {
    // Logic for admin logout
    res.status(200).json({ message: "Admin logged out successfully" });
}

export const adminRegister = (req, res) => {
    // Logic for admin registration
    res.status(201).json({ message: "Admin registered successfully" });
}