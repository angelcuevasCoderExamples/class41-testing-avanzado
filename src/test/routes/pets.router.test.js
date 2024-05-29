const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect; 

const request = supertest("http://localhost:8080")

describe('/api/pets tests', ()=>{
    before(()=>{
        this.petMock = {
            name : 'Einstein',
            specie: 'dog',
            birthDate: '2024-01-01'
        }
    })
    it('Al hacer un POST el endpoint debe poder crear mascotas corectamente', async ()=>{
        const {_body, statusCode} = await request.post('/api/pets').send(this.petMock);
        //console.log(_body)
        expect(_body).to.exist
        expect(statusCode).to.be.equal(200)
        expect(_body.payload).to.have.property('_id')
    })

    it('Al crear una mascota sólo con los datos elementales. Se debe corroborar que la mascota creada cuente con una propiedad adopted : false', async ()=>{
        const {_body, statusCode} = await request.post('/api/pets').send(this.petMock);
        const responsePet = _body.payload;
        expect(statusCode).to.be.equal(200)
        expect(responsePet).to.have.property('adopted')
        expect(responsePet.adopted).to.be.equal(false)
    })

    it('Si se desea crear una mascota sin el campo  nombre, el módulo debe responder con un status 400.', async ()=>{
        const petMockWithoutName = {...this.petMock}
        delete petMockWithoutName.name; 
        
        const {_body, statusCode} = await request.post('/api/pets').send(petMockWithoutName);
        expect(statusCode).to.be.equal(400)
    })

    it('Al obtener a las mascotas con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo.', async ()=>{

        const response = await request.get(`/api/pets`)
        expect(response).to.have.property('status')
        expect(response._body).to.have.property('payload')
        expect(response._body.payload).to.be.a('Array')
        expect(Array.isArray(response._body.payload)).to.be.equal(true)
    })

    it('El método PUT debe poder actualizar correctamente a una mascota determinada ', async ()=>{
        const createResponse = await request.post('/api/pets').send(this.petMock);
        const newPetId = createResponse._body.payload._id; 

        await request.put(`/api/pets/${newPetId}`).send({name: 'changed name'})
        const {_body, statusCode} = await request.get(`/api/pets/${newPetId}`)
        const updatedPet = _body.payload; 


        expect(statusCode).to.be.equal(200);
        expect(updatedPet.name).not.to.be.equal(this.petMock.name)

    })

    it('El método DELETE debe poder borrar la última mascota agregada', async ()=>{
        const createResponse = await request.post('/api/pets').send(this.petMock);
        const newPetId = createResponse._body.payload._id; 

        await request.delete(`/api/pets/${newPetId}`)
        const {_body, statusCode} = await request.get(`/api/pets/${newPetId}`)

        expect(statusCode).to.be.equal(400)
        expect(_body).not.to.have.property('payload')
    })
})