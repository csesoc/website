import React, { useState } from 'react';
// import LoginForm from 'src/components/LoginScreen/LoginForm';
import {Typography, Button} from '@material-ui/core';
import 'src/css/index.css'

const LoginScreen: React.FC = () => {
	const adminUser = {
		email: "admin@admin.com",
		password: "admin123"
	}

    const [details, setDetails] = useState({email: "", password: ""});
	const [email, setEmail] = useState({email: ""});
	const [password, setPassword] = useState({password: ""});
	const [error, setError] = useState("");

	const Login = () => {
		console.log(details);

		if (details.email === adminUser.email && details.password === adminUser.password) {
			console.log("Logged in");
			setEmail({
				email: details.email
			})
            setPassword({
                password: details.password
            })
		} else {
			console.log("Incorrect login details")
			setError("Incorrect login detals")
		}

	}

	const Logout = () => {
		setEmail({ email: "" })
	}

	return (
        // <LoginForm Login={Login} error={error}/>
        <form onSubmit={Login}>
            <div className="form-inner">
				
				<h2>Team Login</h2>
					<div className="form-group">
						<label htmlFor="email">Email: </label>
						<input type="email" name="email" id="email" onChange={
							e => setDetails({...details, email: e.target.value})}  value = {details.email}/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password:</label>
						<input type="password" name="password" id="password" onChange={
							e => setDetails({...details, password: e.target.value})}  value = {details.password}/>
					</div>
					{(error !== "" ? (<div className="error">{error}</div>) : "")}
					{/* <input type="submit" value="LOGIN" /> */}
					<Typography align='center'>
						<Button 
							style={{minWidth: '60px'}}
							size="small"
							onClick={Login} 
							variant="contained" 
							color="default">
						Login
						</Button>
					</Typography>
					
            </div>
			<img src="/images/csesocwhite-logo.png" alt="csesoc-logo" />
        </form>
	);
}

export default LoginScreen;
