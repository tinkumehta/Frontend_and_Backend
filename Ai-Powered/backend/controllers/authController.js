import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

export const register = async (req, res) => {
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'User already exists' })

  const user = await User.create({ name, email, password })
  res.status(201).json({ ...user.toObject(), token: generateToken(user._id) })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' })

  res.json({ ...user.toObject(), token: generateToken(user._id) })
}

export const getMe = async (req, res) => {
  res.json(req.user)
}
