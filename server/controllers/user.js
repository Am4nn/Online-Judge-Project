const loginController = (req, res) => {
    res.status(200).json('loginController')
}
const registerController = (req, res) => {
    res.status(200).json('registerController')
}
const logoutController = (req, res) => {
    res.status(200).json('logoutController')
}

module.exports = { loginController, registerController, logoutController };