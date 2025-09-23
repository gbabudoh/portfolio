import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

// Mock ProjectCounter component
jest.mock('../ProjectCounter', () => {
  return function MockProjectCounter() {
    return <div data-testid="project-counter">Project Counter</div>
  }
})

describe('Hero Component', () => {
  beforeEach(() => {
    // Mock fetch for ProjectCounter
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { total: 7, featured: 3 } }),
      })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders hero section with main heading', () => {
    render(<Hero />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/full-stack developer/i)
  })

  test('renders AI-Enhanced Development Specialist badge', () => {
    render(<Hero />)
    
    const badge = screen.getByText(/AI-Enhanced Development Specialist/i)
    expect(badge).toBeInTheDocument()
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

  test('has proper accessibility attributes', () => {
    render(<Hero />)
    
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveAttribute('id', 'hero')
  })
})
