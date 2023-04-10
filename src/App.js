import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";
import logo from "./logo192.png";

const FILTER_MAP = {
  All: () => true,
  Reported: (task) => !task.recorded,
  Recorded: (task) => task.recorded,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);

  const [filter, setFilter] = useState("All");
  const [lastInsertedId, setLastInsertedId] = useState("");
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  const geoFindMe = () => {
    console.log("geoFindMe", lastInsertedId);
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const mapLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      // console.log(mapLink)
      console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
      locateTask(lastInsertedId, {
        latitude: latitude,
        longitude: longitude,
        error: "",
        mapLink: mapLink,
      });
    }
    function error() {
      console.log("Unable to retrieve your location");
    }
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating...");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify([...tasks]));
  }, [tasks]);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  const addTask = (name) => {
    const id = `todo-${nanoid()}`;
   // add in a checker to ensure photo has been taken, if not return some text and cancel btn onclick
   // if(imgId === null || imgId === undefined) {
    const newTask = {
      id: id,
      name,
      recorded: false,
      location: { latitude: "##", longitude: "##", error: "##", mapLink: "##" },
    };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
  };
  
  //attempt to delete images as well as tasks; no orphan files.
  const deleteTask = (id) => {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    //const deletePhoto = tasks.map((task) => {
      //console.log("deletePhoto", id);
     // if (id === task.id) {
      //  return { ...task, photo: false };
     // }
     // return task;
   // });
    setTasks(remainingTasks);
    // setTasks(deletePhoto);
  };

  const editTask = (id, newName) => {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  };

  const locateTask = (id, location) => {
    console.log("locate Task", id, "before");
    console.log(location, tasks);
    const locatedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, location: location };
      }
      return task;
    });
    console.log(locatedTaskList);
    setTasks(locatedTaskList);
  };

  const toggleTaskCompleted = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, recorded: !task.recorded };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        return { ...task, photo: true };
      }
      return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList);
  };

  const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => (
    <>
      <Todo
        id={task.id}
        name={task.name}
        recorded={task.recorded}
        key={task.id}
        latitude={task.location.latitude}
        longitude={task.location.longitude}
        mapLink={task.location.mapLink}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
        photoedTask={photoedTask}
      />
    </>
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const findsNoun = taskList.length !== 1 ? "finds" : "find";
  const headingText = `${taskList.length} ${findsNoun} logged`;

  return (
    <div className="todoapp stack-large">
      <img src={logo} alt="Logo" />
      <h1>NatureNotation</h1>
      <Form addTask={addTask} geoFindMe={geoFindMe} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;