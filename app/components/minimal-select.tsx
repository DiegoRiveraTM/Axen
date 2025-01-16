'use client'

import Select from 'react-select'
import { motion } from 'framer-motion'

interface MinimalSelectProps {
  label: string
  options: {
    category: string
    programs: string[]
    color: string
  }[]
  value: any
  onChange: (value: any) => void
}

export const MinimalSelect = ({ label, options, value, onChange }: MinimalSelectProps) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'transparent',
      borderColor: 'rgba(16, 185, 129, 0.2)',
      borderWidth: '2px',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      color: 'rgba(255, 255, 255, 0.9)',
      '&:hover': {
        borderColor: 'rgba(16, 185, 129, 0.4)'
      },
      boxShadow: 'none'
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black background for glassmorphism effect
      backdropFilter: 'blur(10px)', // Glassmorphism blur effect
      border: '1px solid rgba(255, 255, 255, 0.1)', // Custom border
      borderRadius: '8px', // Custom border radius
      marginBottom: '8px', // Add a margin at the bottom
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '4px'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
      color: 'rgba(255, 255, 255, 0.9)', // White text color
      padding: '8px 12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'justify', // Justify the text
      '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.6)'
      }
    }),
    group: (provided: any, state: any) => ({
      ...provided,
      padding: '0',
      '& > div:first-of-type': {
        padding: '8px 12px',
        color: 'rgba(255, 255, 255, 0.7)', // Light white text for group labels
        fontSize: '0.9em',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textAlign: 'center', // Center align the group labels
        backgroundColor: 'black' // Black background for group labels
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'rgba(107, 114, 128, 0.5)' // Light white text for placeholder
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.9)' // White text for selected value
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white' // White text for input
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: 'rgba(16, 185, 129, 0.5)',
      '&:hover': {
        color: 'rgba(16, 185, 129, 0.8)'
      }
    })
  }

  const formattedOptions = options.map(category => ({
    label: category.category,
    options: category.programs.map(program => ({
      value: program,
      label: program
    }))
  }))

  return (
    <motion.div
      className="relative space-y-2"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Select 
        options={formattedOptions} 
        styles={customStyles} 
        placeholder={label}
        value={value}
        onChange={onChange}
        menuPlacement="top"
      />
    </motion.div>
  )
}

