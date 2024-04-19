import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'

// 👇 Here are the VALIDATION errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const userSchema = yup.object().shape({
  fullName: yup.string().trim()
    .min(3, validationErrors.fullNameTooShort).max(20,validationErrors.fullNameTooLong),
  size: yup.string()
    .required(validationErrors.sizeIncorrect)
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
})

const getInitialValues = () => ({
  fullName: '',
  size: '',
  toppings: []
})
const getInitialErrors = () => ({
  fullName: '',
  size: ''
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
const [values, setValues] = useState(getInitialValues());
const [errors, setErrors] = useState(getInitialErrors());
const [serverSuccess, setServerSuccess] = useState();
const [serverFailure, setServerFailure] = useState();
const [formSubmiting, setFormSubmiting] = useState(false);

useEffect(() => {
  userSchema.isValid(values).then(setFormSubmiting)
}, [values])

// const onChange = evt => {
//   let { name, value, checked } = evt.target
//   value = name === 'checkbox' ? checked : value
//   setValues({ ...values, [name]: value })
//   yup.reach(userSchema, name).validate(value)
//   .then(() => setErrors({ ...errors, [name]: '' }))
//   .cathc((err) => setErrors({...errors, [name]: err.errors[0]}))
// }

// const onSubmit = evt => { 
//   evt.preventDefault()
//   axios.post('http://localhost:9009/api/order', values)
//     .then(res => {
//       setValues(getInitialValues())
//       setServerSuccess(res.data.message)
//       setServerFailure()
//     })
//     .catch(err => {
//       setServerFailure(err.response.data.message)
//       setServerSuccess()
//     })
// }
  return (
    <form>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='failure'>{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName} </div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value='S'>Small</option>
            <option value='M'>Medium</option>
            <option value='L'>Large</option>
          </select>
        </div>
        {errors.sizeIncorrect && <div className='error'>{errors.sizeIncorrect}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map(({ topping_id, text }) => (
          <div key={topping_id}>
            <label>
              <input name={`topping-${topping_id}`} type="checkbox" />{text}
            </label>
          </div>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!formSubmiting} type="submit" />
    </form>
  )
}
