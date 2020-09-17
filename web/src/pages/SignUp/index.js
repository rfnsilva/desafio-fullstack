import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import history from '../../services/history';

import person1 from '../../assets/person1.svg';
import person from '../../assets/person.svg';
import mail from '../../assets/mail.svg';
import brazil from '../../assets/brazil.svg';
import lock from '../../assets/lock.svg';
import paperAirplane from '../../assets/paper-airplane.svg';


import Input from '../../components/Input';
import InputMasked from '../../components/InputMasked';
import { useToast } from '../../hooks/Toast';


import { Container, Button } from './styles';
import profitfy_logo from '../../assets/profitfy_logo.svg';

function SignUp() {
  const { createToast } = useToast();
  const formRef = useRef(null);

  // Form fields validation and api request
   const handleSubmit = useCallback(async (data) => {

    // Validating fields using yup schema validation
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        surname: Yup.string().required('O sobrenome é obrigatório'),
        email: Yup.string()
                .email('Digite um email válido')
                .required('O email é obrigatório'),
        phone: Yup.string().required('O telefone é obrigatório'),
        password: Yup.string().min(6, 'A senha precisa ter pelo menos 6 caracteres').required('A senha é obrigatória'),
        confirmPassword : Yup.string()
                            .oneOf([Yup.ref('password'), null], 'As senhas devem bater')
                            .required('A confirmação de senha é obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      formRef.current.setErrors({});

    }catch (err) {

      // if the error was generated by yup schema validation
      // is catch this errors and set on unform's form
      if (err instanceof Yup.ValidationError){
        const errorMessages = {}
        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        })
        formRef.current.setErrors(errorMessages);
      }

      createToast({
        type: 'info',
        description: 'Verifique os dados preenchidos',
      });

      // If there is some error the function is stopped
      return
    }


    try{
      await api.post('/user', data);
      createToast({
        type: 'success',
        description: 'Criado com sucesso',
      });
      history.push('/login');
    } catch(e){
      createToast({
        type: 'error',
        description: 'Algo deu errado',
      });
    }

  }, [history, formRef, createToast]);

  return (
    <Container>
      <div className="wrapper">
        <div className="logo">
          <img src={profitfy_logo} alt="ProfitFy.me logo"/>
        </div>
        <div className="form-wrapper">
          <h4>Informe seus dados</h4>
          <Form ref={formRef} className="form-unform" onSubmit={handleSubmit}>
            <Input icon={person1} type="text" placeholder="Nome" name="name"/>
            <Input icon={person} type="text" placeholder="Sobrenome" name="surname"/>
            <Input icon={mail} type="text" placeholder="Email Pessoal" name="email"/>
            <InputMasked mask="(99) 99999-9999" icon={brazil} type="text" name="phone"/>
            <Input icon={lock} type="password" placeholder="Senha" name="password"/>
            <Input icon={lock} type="password" placeholder="Confirmar Senha" name="confirmPassword"/>
            <p>Ao se cadastrar você automaticamente concorda com nossos. <Link to="#">Termos de Uso</Link></p>
            <Button className="submit-button" type="submit">
              <img src={paperAirplane} alt="paper airplane icone"/>
              Cadastrar
            </Button>
          </Form>
        </div>
        <div className="bottom-options">
          <Link to="#">Esqueceu sua senha?</Link>
          <Link to="/login">Entrar</Link>
        </div>
      </div>
    </Container>
  );
}

export default SignUp;
