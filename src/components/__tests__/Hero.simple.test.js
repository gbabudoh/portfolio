import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

// Mock ProjectCounter component
jest.mock('../ProjectCounter', () => {
  return function MockProjectCounter() {
    return <div data-testid="project-counter">Project Counter</div>
  }
})

describe('Hero Component - Simple Tests', () => {
  test('renders hero section with main heading', () => {
    render(<Hero />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  test('renders CTA buttons', () => {
    render(<Hero />)
    
    const viewWorkButton = screen.getByText(/View My Work/i)
    const getInTouchButton = screen.getByText(/Get In Touch/i)
    
    expect(viewWorkButton).toBeInTheDocument()
    expect(getInTouchButton).toBeInTheDocument()
  })

  test('renders ProjectCounter component', () => {
    render(<Hero />)
    
    const projectCounter = screen.getByTestId('project-counter')
    expect(projectCounter).toBeInTheDocument()
  })
})
