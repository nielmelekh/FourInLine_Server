const users = [
  { userId: 1, firstName: "Dan", lastName: "Smith", password: "password123",
    email: "DanSmith@gmail.com", username: "DanSmith",
    createDate: new Date("2023-01-01T01:00:00Z"), updateDate: new Date("2023-01-01T01:00:00Z"),
    userRole: "admin"},
  { userId: 2, firstName: "Maya", lastName: "Johnson", password: "password123",
    email: "MayaJohnson@gmail.com", username: "MayaJohnson",
    createDate: new Date("2023-01-01T01:00:00Z"), updateDate: new Date("2023-01-01T01:00:00Z"),
    userRole: "manager"},
  { userId: 3, firstName: "Noa", lastName: "Williams", password: "password123",
    email: "NoaWilliams@gmail.com", username: "NoaWilliams",
    createDate: new Date("2023-01-01T01:00:00Z"), updateDate: new Date("2023-01-01T01:00:00Z"),
    userRole: "user"},
  { userId: 4, firstName: "Eli", lastName: "Brown", password: "password123",
    email: "EliBrown@gmail.com", username: "EliBrown",
    createDate: new Date("2023-01-01T01:00:00Z"), updateDate: new Date("2023-01-01T01:00:00Z"),
    userRole: "user"},
  { userId: 5, firstName: "Lior", lastName: "Davis", password: "password123",
    email: "LiorDavis@gmail.com", username: "LiorDavis",
    createDate: new Date("2023-01-01T01:00:00Z"), updateDate: new Date("2023-01-01T01:00:00Z"),
    userRole: "user"},
]

const managementRoles = ["admin", "manager"]

module.exports = { users, managementRoles }