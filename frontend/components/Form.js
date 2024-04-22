import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as Yup from 'yup'

// 👇 Here are the VALIDATION errors you will use with Yup.
const validationErrors = {
  fullNameRequired:'name is required',
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeRequired:'size is required',
  sizeIncorrect: 'size must be S or M or L'
}

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

// 👇 Here you will create your schema.
const schema = Yup.object().shape({
  fullName: Yup.string().trim()
    .required(validationErrors.fullNameRequired)
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: Yup.string()
    .required(validationErrors.sizeRequired)
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
})

export default function Form() {
  const [values, setValues] = useState(getInitialValues());
  const [errors, setErrors] = useState(getInitialErrors());
  const [serverSuccess, setServerSuccess] = useState();
  const [serverFailure, setServerFailure] = useState();
  const [formSubmiting, setFormSubmiting] = useState(false);

  useEffect(() => {
    schema.isValid(values).then(setFormSubmiting)
  }, [values])

  const onChange = evt => {
   let { type, name, value, checked } = evt.target
   value = type == 'checkbox' ? checked : value
   setValues({...values, [name]: value})
   Yup.reach(schema, name).validate(value)
    .then(() => setErrors({ ...errors, [name]: ''}))
    .catch((err) => setErrors({...errors, [name]: err.errors[0]}) )
  }

  const handleSubmit = evt => { 
    schema.validate(values)
    evt.preventDefault()
    axios.post('http://localhost:9009/api/order', values)
      .then(res => {
        setValues(getInitialValues())
        setServerSuccess(res.data.message)
        setServerFailure()
      })
      .catch(err => {
        setServerFailure(err.response.data.message)
        setServerSuccess()
      })
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='failure'>{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input 
          value={values.fullName}
          onChange={onChange}
          name= 'fullName'
          placeholder="Type full name" 
          id="fullName" 
          type="text" 
          />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName} </div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
          onChange={onChange}
          value={values.size}
          name='size' 
          id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value='S'>Small</option>
            <option value='M'>Medium</option>
            <option value='L'>Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map(({ topping_id, text }) => (
          <label key={topping_id}>
            <input 
            checked={values.toppings.includes(topping_id)}
            onChange={(e) => {
              const updatedToppings = e.target.checked
                ? [...values.toppings, topping_id]
                : values.toppings.filter((t) => t !== topping_id);
              setValues({ ...values, toppings: updatedToppings });
            }}
            name={`${topping_id}`} 
            type="checkbox" />{text}
            <br />
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!formSubmiting} type="submit" />
    </form>
  )
}
