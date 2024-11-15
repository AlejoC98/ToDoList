"use client";
import { Button, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'

interface Task {
  id: number;
  name: string;
  isDeleted: boolean;
  isComplete: boolean;
}

const Dashboard = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [username, setUsername] = useState<String>("");
  const [task, setTask] = useState<any>("");
  const [isUserCreated, setIsUserCreated] = useState<boolean>(false);

  const [countTask, setCountTask] = useState<number>(0);
  const [pendingTasks, setPendingTask] = useState<number>(0);

  const [userTasks, setUserTasks] = useState<Array<Task>>([]);

  const handleNewUser = () => {
    setIsUserCreated(true);
    setIsModalOpen(false);
    localStorage.setItem('username', JSON.stringify(username));
  }

  const addNewTask = () => {
    setUserTasks((prev) => [...prev, {
      id: countTask,
      name: task,
      isDeleted: false,
      isComplete: false
    }]);

    setTask("");
    setCountTask((prev) => prev + 1);
    handleSaveLocalStorage();
  }

  const checkPendingTask = () => {
    const pending = userTasks.filter((task) => task.isComplete == false && task.isDeleted == false);

    setPendingTask(pending.length);
  }

  const handleDeleteTask = (taskId: number) => {
    const findTask = userTasks.find((task) => task.id === taskId);

    if (findTask != null) {
      findTask!.isDeleted = true;

      setUserTasks((prev) => [...prev]);
      handleSaveLocalStorage();
    }

  }

  const handleTaskCompleted = (completed: boolean, taskId: number) => {
    const findTask = userTasks.find((task) => task.id === taskId);

    if (findTask != null) {
      findTask!.isComplete = completed;

      setUserTasks((prev) => [...prev]);
      handleSaveLocalStorage();
    }
  }

  const handleSaveLocalStorage = () => {
    localStorage.setItem("userTask", JSON.stringify(userTasks));
  }

  const checkLocalStorage = () => {
    const loadedTask = localStorage.getItem('userTask');
    const lastUser = localStorage.getItem('username');

    if (lastUser != null) {
      setUsername(JSON.parse(lastUser));
      setIsModalOpen(false);
      setIsUserCreated(true);
    }


    if (loadedTask != null) {
      setUserTasks(JSON.parse(loadedTask));
    }
  }

  const handleLogOut = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userTask');

    setUsername('');
    setUserTasks([]);
    setIsUserCreated(false);
  };

  useEffect(() => {
    checkPendingTask();
  }, [userTasks]);

  useEffect(() => {
    checkLocalStorage();
  }, [])

  return (
    <div style={{"display": "flex", "height": "100vh", "width": "100vw", "background": "#F4EBBE", "paddingTop": 100}}>
      {username != "" && (
        <div style={{"position": "absolute", "right": 20, "top": 20}}>
          <div style={{"display": "flex", "gap": 10, "alignItems": "center"}}>
            <p>{username} </p>
            <Button onClick={handleLogOut}>Leave</Button>
          </div>
          { userTasks.length > 0 && (
            <p>Pending Tasks: {pendingTasks}</p>
          )}
        </div>
      )}
      { !isUserCreated ? (
<div style={{"display": "flex", "justifyContent": "center", "alignItems": "center", "height": "100vh", "width": "100%"}}>
        <Button onClick={() => setIsModalOpen(true)}>Let's start</Button>
      </div>
      ) : (
        <div style={{"margin": "0 auto", "width": 500}}>
          <h1 style={{"textAlign": "center"}}>Your tasks</h1>
          <div style={{"display": "flex", "gap": 10}}>
            <Input style={{ "width": "100%"}} type='text' placeholder='Create' size='large' value={task} onChange={(e) => setTask(e.target.value)}/>
            <Button size='large' onClick={addNewTask}>Add</Button>
          </div>
          <div style={{ "height": "300px", "padding": "10px 5px", "display": "flex", "flexDirection": "column", "gap": 10, "overflowY": userTasks.length > 3 ? "scroll" : "hidden", "marginTop": 20}}>
            {userTasks.map((task) => (
              task.isDeleted == false &&
              <div key={task.id} style={{"background": "#fff", "padding": "5px 10px", "borderRadius": 5, "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": 10}}>
                <div>
                  <h3 style={{ "textDecoration": task.isComplete ? "line-through" : "none", "color": task.isComplete ? "gray" : "black"}}>{ task.name }</h3>
                </div>
                    <div style={{"display": "flex", "gap": 5, "alignItems": "center"}}>
                    {task.isComplete == false && (
                      <Button onClick={() => handleDeleteTask(task.id)}>
                        Delete
                      </Button>
                    )}
                    <input type='checkbox' onChange={(e) => handleTaskCompleted(e.target.checked, task.id)} />
                  </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal title="Add new user" open={isModalOpen} onOk={handleNewUser} onCancel={() => setIsModalOpen(false)}>
        <Input size='large' type='text' placeholder='name' allowClear={true} onChange={(e) => setUsername(e.target.value)}/>
      </Modal>
    </div>
  )
}

export default Dashboard