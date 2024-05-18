import React, { useState, useEffect } from 'react';
import './todoApp.css';

function Hello() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null); // State to track the selected radio button
    const [newTask, setNewTask] = useState(''); // State for the new task input

    useEffect(() => {
        fetch('http://localhost:5000/api/todos')
        .then(response => response.json())
        .then(tasks => setTasks(tasks.allTasks))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleRadioChange = (task) => {
        setSelectedTask(task.id); // Assuming each task has a unique ID
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTask })
            });
            if (response.ok) {
                console.log('Task added successfully');
                // Refresh tasks after adding a new one
                const updatedTasks = await response.json();
                setTasks(updatedTasks.allTasks);
                setNewTask(''); // Clear the input field
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <>
            <h1 className='hello'>TO DO</h1>
            <div className='main-container'>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Create new to do" 
                        className='new-todo' 
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button type="submit">Add Task</button>
                </form>
                {tasks.map((task) => (
                    <div key={task.id} className='radioInput'>
                        <input 
                            type="radio" 
                            name="task" 
                            checked={selectedTask === task.id}
                            onChange={() => handleRadioChange(task)}
                        />
                        <label>{task.title}</label>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Hello;
