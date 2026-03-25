/**
 * Tests: UI Components
 * Covers Button, Input, and NoteForm rendering + interactions
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NoteForm from '@/components/notes/NoteForm'
import type { NoteFormValues } from '@/components/notes/NoteForm'

//Button

describe('Button component', () => {
  it('renders with correct label', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Submit</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not fire onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})

//Input

describe('Input component', () => {
  it('renders with placeholder text', () => {
    render(<Input placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('reflects typed value via onChange', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders as password type when type="password"', () => {
    const { container } = render(<Input type="password" />)
    const input = container.querySelector('input')
    expect(input?.type).toBe('password')
  })
})

//NoteForm

const defaultValues: NoteFormValues = {
  title: '',
  description: '',
  status: 'pending',
  dueDate: '',
  image: '',
}

describe('NoteForm component', () => {
  it('renders all form fields', () => {
    render(<NoteForm values={defaultValues} errors={{}} onChange={vi.fn()} />)
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
  })

  it('displays title error message when provided', () => {
    render(<NoteForm values={defaultValues} errors={{ title: 'Title is required' }} onChange={vi.fn()} />)
    expect(screen.getByText('Title is required')).toBeInTheDocument()
  })

  it('displays due date error message when provided', () => {
    render(<NoteForm values={defaultValues} errors={{ dueDate: 'Due date is required' }} onChange={vi.fn()} />)
    expect(screen.getByText('Due date is required')).toBeInTheDocument()
  })

  it('calls onChange when title is typed', () => {
    const handleChange = vi.fn()
    render(<NoteForm values={defaultValues} errors={{}} onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Note' } })
    expect(handleChange).toHaveBeenCalledWith('title', 'New Note')
  })

  it('shows pre-filled title value', () => {
    render(<NoteForm values={{ ...defaultValues, title: 'Existing Note' }} errors={{}} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('Existing Note')).toBeInTheDocument()
  })

  it('shows status dropdown with correct default', () => {
    render(<NoteForm values={defaultValues} errors={{}} onChange={vi.fn()} />)
    const select = screen.getByLabelText(/status/i) as HTMLSelectElement
    expect(select.value).toBe('pending')
  })
})
