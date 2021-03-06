import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
//Rota: Receber a requisição, chamar outro arquivo, devoler uma resposta
const appointmentsRouter = Router();

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', (request, response) => {
  console.log(request.user);

  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = appointmentsRepository.find();

  return response.json(appointments);
});


appointmentsRouter.post('/', async (request , response) => {
  try {
    const { provider_id, date } = request.body;
      
    const parsedDate = parseISO(date);

    const createAppoinment = new CreateAppointmentService();

    const appointment = await createAppoinment.execute({
      date:parsedDate,
      provider_id
    });
  
    

    return response.json(appointment);  

  } catch(err) {
    return response.status(400).json({error: err.message});
  }

  
});

export default appointmentsRouter;