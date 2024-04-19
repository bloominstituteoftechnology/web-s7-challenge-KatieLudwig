import React from 'react'
import pizza from './images/pizza.jpg'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate();

  const imageClick = () => {
    navigate('/order');
  }
  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      {/* clicking on the img should navigate to "/order" */}

      <img 
        onClick={imageClick}
        alt="order-pizza" 
        style={{ cursor: 'pointer' }} 
        src={pizza} 
      />
    </div>
  )
}


