"use client";

import React from "react";
import DeveloperButton from "@/components/devButton";
import { createUserSchema } from "@flock/shared/schemas/user";
import { z } from "zod";

export default function DeveloperTools() {
  const getUsers = () => {
    fetch("http://localhost:4000/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addUser = (data: z.infer<typeof createUserSchema>) => {
    fetch("http://localhost:4000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    };

    const result = createUserSchema.safeParse(data);

    if (!result.success) {
      console.error("Validation errors:", result.error);
      return;
    }

    addUser(result.data);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center dark:bg-black gap-4">
      <h1>DEVELOPER TOOLS PAGE</h1>
      <DeveloperButton onClick={getUsers}>Get Users</DeveloperButton>
      {/* <h2>Add to Database</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            name="firstName"
            placeholder="First name"
          />
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            name="lastName"
            placeholder="Last name"
          />
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            name="email"
          />
          <button
            className="bg-purple-500 hover:purple-400 border-purple-700 hover:border-purple-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            type="submit"
          >
            Add User
          </button>
        </form>
      </div> */}
    </div>
  );
}
