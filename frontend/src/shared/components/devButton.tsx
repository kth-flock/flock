'use client'
import React from 'react'


const colorClasses = {
  blue: 'bg-blue-500 hover:bg-blue-400 border-blue-700 hover:border-blue-500',
  green: 'bg-green-500 hover:bg-green-400 border-green-700 hover:border-green-500',
  purple: 'bg-purple-500 hover:bg-purple-400 border-purple-700 hover:border-purple-500',
} as const;

export interface DeveloperButtonProps {
    onClick: () => void;
    children: React.ReactNode;  
    color?: string;
}
export default function DeveloperButton ({ onClick, color = 'blue', children }: DeveloperButtonProps) {
    return (
        <div>
            <button onClick={onClick} className= {`${colorClasses[color as keyof typeof colorClasses]} text-white font-bold py-2 px-4 border-b-4 border-${color}-700 hover:border-${color}-500 rounded`}>
                {children}
            </button>
        </div>
    );
}
