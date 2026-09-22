'use client'

import React from 'react'
import DeveloperButton from '@/components/devButton';



export default function DeveloperTools() {
    const getUsers = () => {
        fetch('http://localhost:4000/users')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    const addUser = (name: string, email: string) => {
        fetch('http://localhost:4000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get("name");
        const email = formData.get("email");
        addUser(name as string, email as string);
    }

    return (
      <div className="flex flex-col flex-1 items-center justify-center dark:bg-black gap-4">
        <h1>DEVELOPER TOOLS PAGE</h1>
            <DeveloperButton onClick={getUsers}>
            Get Users
        </DeveloperButton>
        <h2>Add to Database</h2>
        <div>
            <form onSubmit={handleSubmit}>
                <input  className="border-2 border-gray-300 rounded-md p-2" name="name" />
                <input className="border-2 border-gray-300 rounded-md p-2" name ="email" />
                <button  className="bg-purple-500 hover:purple-400 border-purple-700 hover:border-purple-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" type="submit">Add User</button>
            </form>
        </div>
        <div id="users"></div>
      </div>
    );
  }
  