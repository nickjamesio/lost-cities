import React, { useState, useEffect } from "react";


function Example(props) {
  const [count, setCount] = useState(0);
  const { blah } = props;

  // Similar to componentDidMount and componentDidUpdate:

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
    console.log("I'm in an effect");
  }, [blah]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default Example;
