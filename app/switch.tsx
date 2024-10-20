import React from 'react'
import './switch.css' // Import the CSS file for styling

interface SwitchProps {
  isOn: boolean
  handleToggle: () => void
}

const Switch: React.FC<SwitchProps> = ({isOn, handleToggle}) => {
  return (
    <div className="switch-container">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="switch-checkbox"
        id={`switch-new`}
        type="checkbox"
      />
      <label className="switch-label" htmlFor={`switch-new`}>
        <span className={'switch-button'} />
      </label>
    </div>
  )
}

export default Switch
