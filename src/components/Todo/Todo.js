import React from 'react';
import './todo.css';

export default function Todo() {
  const [tasks, setTasks] = React.useState(
    ['these are just some example tasks', 
    'you cannot accomplish them',
    'because they are not really tasks']);
  const [inputText, setInputText] = React.useState('');
  const [grabData, setGrabData] = React.useState({
    id: null,
    mouseY: 0,
    elemenY: null,
    style: {
      top: 0,
      position: 'relative',
    },
  });

  function handleTextInput(event) {
    const { value } = event.target;
    setInputText(value);
  }

  function handleFormSubmit(event) {
    console.log(inputText)
    event.preventDefault();
    setTasks((prevTasks) => [...prevTasks, inputText]);
    setInputText('');
  }

  function removeTask(id) {
    setTasks((prevTasks) => prevTasks.filter((_, index) => id !== index));
  }

  function grabItem(event, id) {
    const mouseY = event.clientY;
    const elementY = document.querySelector(`#task-element-${id}`).getBoundingClientRect().y;
    setGrabData({ mouseY, id, elementY, style: { position: 'relative', top: 0 } });
  }

  React.useEffect(() => {
    const onMouseMove = (event) => {
      if(grabData.id === null)
        return;

      setGrabData((prev) => ({
        ...prev,
        style: {
          position: 'relative',
          top: event.clientY - prev.mouseY
        }
      }));
    }

    const onMouseUp = () => {
      const items = Array.from(document.querySelectorAll('.todo-list__item'));
      const itemsOrder = [];

      while(items.length) {
        let smallestY = { value: 6969696969, index: -1 };
        for(let i = 0; i < items.length; i++) {
          if(smallestY.value > items[i].getBoundingClientRect().y)
            smallestY = { value: items[i].getBoundingClientRect().y, index: i };
        }
        itemsOrder.push(items.splice(smallestY.index, 1)[0].children[0].textContent);
      }

      setTasks(itemsOrder);
      setGrabData(prev => ({...prev, id: null}))
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
  }, [grabData]);

  const taskElements = tasks.map((text, id) => 
      <li
        id={`task-element-${id}`}
        key={Math.random()}
        className="todo-list__item"
        onMouseDown={(event) => grabItem(event, id)}
        style={id === grabData.id ? grabData.style : {}}
      >
        <span>{text}</span>
        <button 
          onMouseDown={() => removeTask(id)}
        >
          Delete
        </button>

      </li>
  );

  return (
    <div className="todo-list">

      <h1>Things I&apos;m gonna do:</h1>

      <form
        onSubmit={handleFormSubmit}
      >

      <input
        type="text"
        value={inputText}
        onChange={handleTextInput}
      />

      <button>Add</button>

      </form>

      <ol className="todo-list__list">

        {taskElements}

      </ol>

    </div>
  );
}