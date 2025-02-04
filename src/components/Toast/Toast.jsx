import React from 'react'
import {assets} from '../../assets/assets';
import './Toast.css'

const Toast = (props) => {

    const text = props.text || "Server busy right now!"
    const status = props.status || "error";
    const icon = status === 'error' ? assets.error_icon : status === 'warning' ? assets.warning_icon : assets.info_icon; 


  return (
    <div className='ug-Toast'>
        <img src={icon} alt="" />
        <span className={status}>{text}</span>
    </div>
  )
}

export default Toast