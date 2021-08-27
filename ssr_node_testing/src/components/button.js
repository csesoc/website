import React from 'react'

function Button(props) {
  const handleClick=()=> {
    console.log(props.name)
  }
  return (
    <div>
      <button onClick={handleClick}>
        {props.name}
      </button>
    </div>
  )
}

export default Button
