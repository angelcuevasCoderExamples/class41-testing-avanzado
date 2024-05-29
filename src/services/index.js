const Users = require("../dao/Users.dao.js");
const Pet = require("../dao/Pets.dao.js");
const Adoption = require("../dao/Adoption.js");

const UserRepository = require("../repository/UserRepository.js");
const PetRepository = require("../repository/PetRepository.js");
const AdoptionRepository = require("../repository/AdoptionRepository.js");

const usersService = new UserRepository(new Users());
const petsService = new PetRepository(new Pet());
const adoptionsService = new AdoptionRepository(new Adoption());

module.exports = {
    usersService,
    petsService,
    adoptionsService
}