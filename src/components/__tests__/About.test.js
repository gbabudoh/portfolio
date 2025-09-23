import { render, screen, waitFor } from '@testing-library/react'
import About from '../About'

// Mock ProjectCounter component
jest.mock('../ProjectCounter', () => {
  return function MockProjectCounter() {
    return <div data-testid="project-counter">Project Counter</div>
  }
})

// Mock fetch
global.fetch = jest.fn()

describe('About Component', () => {
  const mockAboutContent = [
    {
      id: 1,
      section: 'main_description',
      title: 'About Me',
      content: 'I am a passionate full-stack developer with 5 years of experience.'
    },
    {
      id: 2,
      section: 'experience_paragraph',
      title: 'Experience',
      content: 'With over 5 years of experience in web development...'
    },
    {
      id: 3,
      section: 'ai_integration',
      title: 'AI Integration',
      content: 'I leverage AI tools like ChatGPT, Cursor, and Windsurf...'
    },
    {
      id: 4,
      section: 'specialization',
      title: 'Specialization',
      content: 'I specialize in modern web technologies and AI-enhanced development.'
    }
  ]

  beforeEach(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockAboutContent })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders about section with heading', async () => {
    render(<About />)
    
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/About Me/i)
  })

  test('displays dynamic about content', async () => {
    render(<About />)
    
    await waitFor(() => {
      expect(screen.getByText('I am a passionate full-stack developer with 5 years of experience.')).toBeInTheDocument()
      expect(screen.getByText('With over 5 years of experience in web development...')).toBeInTheDocument()
    })
  })

  test('shows loading state initially', () => {
    render(<About />)
    
    // Should show loading or default content while fetching
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
  })

  test('renders ProjectCounter component', async () => {
    render(<About />)
    
    await waitFor(() => {
      const projectCounter = screen.getByTestId('project-counter')
      expect(projectCounter).toBeInTheDocument()
    })
  })

  test('displays experience stats', async () => {
    render(<About />)
    
    await waitFor(() => {
      expect(screen.getByText(/5\+ Years Experience/i)).toBeInTheDocument()
      expect(screen.getByText(/50\+ Projects Completed/i)).toBeInTheDocument()
    })
  })

  test('handles API error gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'))
    
    render(<About />)
    
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })
  })
})
