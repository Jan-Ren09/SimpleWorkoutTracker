import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'

export default function Login() {

    const notyf = new Notyf({
        duration: 3000, 
        position: {
            x: 'right', 
            y: 'top'    
        }});

    const token =  localStorage.getItem('token')
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

    
        e.preventDefault();
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.access !== undefined){

                console.log(data.access);

                
                localStorage.setItem('token', data.access)


                
                setEmail('');
                setPassword('');

                notyf.success(`You are now logged in`);
            
            } else if (data.message === "Email and password do not match") {

                notyf.error(`Email and password do not match`);

            } else {

               notyf.error(`${email} does not exist`);
            }
        })
    }


    useEffect(() => {

        
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (    
        (token)
        ?
        <Navigate to="/" />
        :
        <div className='d-flex justify-content-center align-items-center vh-100'>
            <Form 
                onSubmit={(e) => {authenticate(e)}} 
                
                className='container p-4 shadow-lg bg-dark border-white text-light rounded'
            >
                <h1 className="my-3 text-center">Login</h1>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant={isActive ? "primary" : "danger"} type="submit" id="loginBtn" disabled={!isActive}>
                    Login
                </Button>
                <p className="text-center mt-3">No account yet? <Link to="/register" style={{ color: '#0d6efd' }}>Sign up</Link> here</p>
            </Form>
        </div>
    );
    
}