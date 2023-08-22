import React from 'react';

const Panel = () => {

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const loginData = Object.fromEntries(formData.entries());

    try {
      await fetch('https://servertest264895.onrender.com/api/panel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Login failed');
          }
        })
        .then(data => {
          const token = data.token;
          localStorage.setItem('token', token);
          console.log("token: ", token);
        });

    } catch (error){
      alert("error: ", error);
      console.error("Error with sending login: ", error);
    }
  }


  return (
    <div id="form">
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required />
        <br />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Panel;