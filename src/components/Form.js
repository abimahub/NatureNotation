import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import WebcamCapture from "./WebcamCapture";


function Form(props) {
  const [addition, setAddition] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoFindMe();
      setAddition(false);
    }
  }, [addition, props]);

  const handleChanged = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    setAddition(true);
    props.addTask(name);
    setName("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        
        <label htmlFor="new-todo-input" className="label__lg">
          What did you find?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChanged}
      />
      <div className="btn-group">
        <Popup
          trigger={
            <button type="button" className="btn">
              Take Photo
            </button>
          }
          modal
        >
          <div>
            <WebcamCapture
              id={props.id}
              name={props.name}
              photoedTask={props.photoedTask}
            ></WebcamCapture>
          </div>
        </Popup>

        <button type="submit" className="btn btn__primary">
          Log Find
        </button>
      </div>
    </form>
  );
}

export default Form;
