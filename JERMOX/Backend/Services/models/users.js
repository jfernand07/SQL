let users = []; // simulación de tabla usuarios en memoria

function addUser(user) {
users.push(user);
}

function findUserByEmail(email) {
return users.find(u => u.email === email);
}

function getAllUsers() {
return users;
}

module.exports = { addUser, findUserByEmail, getAllUsers };
