import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

//Rota: Receber a requisição, chamar outro arquivo, devoler uma resposta
const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request , response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // delete user.password;

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updatead_at: user.updated_at,
    }


    return response.json(userWithoutPassword);
  } catch(err) {
    return response.status(400).json({error: err.message});
  }

  
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar') , async (request, response) => {
  try {
    const updateUserAvatar = new UpdateUserAvatarService(); 

    await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    return response.json({ ok : true });
    
  } catch (err) {
    return response.status(400).json({error: err.message});
  }  
  
});

export default usersRouter; 