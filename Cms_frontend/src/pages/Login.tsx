import React, { useState } from 'react';
//import LoginForm from 'src/components/LoginScreen/LoginForm';
import {Typography, Button} from '@material-ui/core';
import styled from 'styled-components';

const Container = styled.div`
	margin: 0;
	padding: 0;
 	box-sizing: border-box;
 	font-family: montserrat, sans-serif;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #1D1F20
`

const Input = styled.input`
	appearance: none;
	background: none;
	border: none;
`
const InputSubmit = styled.input.attrs({
	type: 'submit',
})`
	display: inline-block;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: #F8F8F8;
  background-size: 200%;
  background-position: 0%;
  transition: 0.4s;
  cursor: pointer;
`

const Form = styled.form`
	display: block;
	position: relative;
`
const FormInner = styled.form`
	position: relative;
  display: block;
  padding: 30px;
  z-index: 2;
`
const FormGroup = styled.form`
	display: block;
  width: 300px;
  margin-bottom: 15px;
`
const FormLabel = styled.label`
	display: block;
  color: #C4C4C4;
  font-size: 12px;
  margin-bottom: 5px;
  transition: 0.4s;

	&:focus-within {
		color: #FFFFFF;
	}
`
const FormError = styled.div`
	display: block;
  text-align: center;
  color: #b62e2e;
  padding: 0px 0px 15px;
`
const FormGroupInput = styled.input`
	display: block;
  width: 100%;
  padding: 10px 15px;
  background-color: #C4C4C4;
  border-radius: 8px;
  transition: 0.4s;

	&:focus {
		box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
	}
`
const Img = styled.img`
	display: block;
  width: auto;
  height: auto;
  max-width: 200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
`

const H2 = styled.h2`
	text-align: center;
  color: #F8F8F8;
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 100px;
`

const LoginScreen: React.FC = () => {
	// const adminUser = {
	// 	email: "admin@admin.com",
	// 	password: "admin123"
	// }

	// const [details, setDetails] = useState({email: "", password: ""});

	const [email, setEmail] = useState({email: ""});
	const [password, setPassword] = useState({password: ""});
	const [auth, setAuth] = useState({auth: false})

	

	const [error, setError] = useState("");

	const Login = () => {
		// method="POST" action="http://localhost:8080/login"
		// const requestOptions = {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json'},
		// 	body: JSON.stringify({ email, password })
		// };
		// fetch('http://localhost:8080/login', requestOptions)
		// 	.then(response => response.json())
		// 	.then(data => setAuth)


		// console.log(email, password);

		// if (details.email === adminUser.email && details.password === adminUser.password) {
		// 	console.log("Logged in");
		// 	setEmail({
		// 		email: details.email
		// 	})
        //     setPassword({
        //         password: details.password
        //     })
		// } else {
		// 	console.log("Incorrect login details")
		// 	setError("Incorrect login details")
		// }

	}

	const Logout = () => {
		setEmail({ email: "" })
	}

	return (
        // <LoginForm Login={Login} error={error}/>
		<Container>
			<Form method="POST" action="http://localhost:8080/login">
				<FormInner>
					<H2>Team Login</H2>
						<FormGroup>
							<FormLabel htmlFor="email">Email: </FormLabel>
							<FormGroupInput type="text" name="email" id="email" value = {email.email}/>
							{/* onChange={ e => setEmail({email: e.target.value})} */}
						</FormGroup>
						<FormGroup>
							<FormLabel htmlFor="password">Password:</FormLabel>
							<FormGroupInput type="text" name="password" id="password" value = {password.password}/>
							{/* onChange={ e => setPassword({password: e.target.value})} */}
						</FormGroup>
						{(error !== "" ? (<FormError>{error}</FormError>) : <FormError>ㅤ</FormError>)}
						{/* <input type="submit" value="LOGIN" /> */}
						<Typography align='center'>
							<input 
								type="submit"
								value="submit"
								// style={{minWidth: '60px'}}
								// size="small"
								// variant="contained" 
								// color="default"
								>
							Login
							</input>
						</Typography>
				</FormInner>
				<Img src="/images/csesocwhite-logo.png" alt="csesoc-logo" />
			</Form>
		</Container>
	);
}

export default LoginScreen;
