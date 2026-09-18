'use client'

import React from 'react'
import DeveloperButton from '@/components/button';



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
    
    return (
      <div className="flex flex-col flex-1 items-center justify-center dark:bg-black gap-4">
        <h1>DEVELOPER TOOLS PAGE</h1>
            <DeveloperButton onClick={getUsers}>
            Get Users
        </DeveloperButton>
        <h2>Add to Database</h2>
        <DeveloperButton onClick={() => {
            console.log('debug');
        }} color="purple">
            Add User to Database
        </DeveloperButton>
        <div id="users"></div>
      </div>
    );
  }
  