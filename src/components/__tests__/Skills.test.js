import { render, screen, waitFor } from '@testing-library/react'
import Skills from '../Skills'

// Mock fetch
global.fetch = jest.fn()

describe('Skills Component', () => {
  const mockSkills = [
    {
      id: 1,
      name: 'React',
      category: 'Frontend',
      level: 'Expert',
      icon: '⚛️'
    },
    {
      id: 2,
      name: 'Node.js',
      category: 'Backend',
      level: 'Advanced',
      icon: '🟢'
    },
    {
      id: 3,
      name: 'JavaScript',
      category: 'Languages',
      level: 'Expert',
      icon: '🟨'
    }
  ]

  beforeEach(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockSkills })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders skills section with heading', async () => {
    render(<Skills />)
    
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/Technical Skills/i)
  })

  test('renders category tabs', async () => {
    render(<Skills />)
    
    await waitFor(() => {
      expect(screen.getByText('Frontend')).toBeInTheDocument()
      expect(screen.getByText('Backend')).toBeInTheDocument()
      expect(screen.getByText('Languages')).toBeInTheDocument()
    })
  })

  test('displays skills for selected category', async () => {
    render(<Skills />)
    
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
    })
  })

  test('shows skill levels', async () => {
    render(<Skills />)
    
    await waitFor(() => {
      expect(screen.getByText('Expert')).toBeInTheDocument()
      expect(screen.getByText('Advanced')).toBeInTheDocument()
    })
  })

  test('handles API error gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'))
    
    render(<Skills />)
    
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })
  })
})
