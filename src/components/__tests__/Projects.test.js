import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Projects from '../Projects'

// Mock CloudinaryImage component
jest.mock('../CloudinaryImage', () => {
  return function MockCloudinaryImage({ alt, ...props }) {
    return <img alt={alt} {...props} data-testid="cloudinary-image" />
  }
})

// Mock fetch
global.fetch = jest.fn()

describe('Projects Component', () => {
  const mockProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A modern e-commerce solution',
      category: 'e-commerce',
      technologies: 'React, Node.js, Stripe',
      featured: 1,
      image_url: 'https://example.com/image1.jpg',
      image_public_id: 'project1'
    },
    {
      id: 2,
      title: 'Business site',
      description: 'A business management system',
      category: 'Business site',
      technologies: 'Vue.js, Express, MongoDB',
      featured: 0,
      image_url: 'https://example.com/image2.jpg',
      image_public_id: 'project2'
    }
  ]

  beforeEach(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockProjects })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders projects section with heading', async () => {
    render(<Projects />)
    
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/Featured Projects/i)
  })

  test('renders category filter buttons', async () => {
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument()
      expect(screen.getByText('e-commerce')).toBeInTheDocument()
      expect(screen.getByText('Business site')).toBeInTheDocument()
    })
  })

  test('displays project cards', async () => {
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument()
      expect(screen.getByText('Business site')).toBeInTheDocument()
    })
  })

  test('filters projects by category', async () => {
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument()
    })
    
    const ecommerceButton = screen.getByText('e-commerce')
    fireEvent.click(ecommerceButton)
    
    await waitFor(() => {
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument()
      expect(screen.queryByText('Business site')).not.toBeInTheDocument()
    })
  })

  test('opens project modal when view details is clicked', async () => {
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument()
    })
    
    const viewDetailsButton = screen.getAllByText(/View Details/i)[0]
    fireEvent.click(viewDetailsButton)
    
    await waitFor(() => {
      expect(screen.getByText('A modern e-commerce solution')).toBeInTheDocument()
    })
  })

  test('closes project modal when close button is clicked', async () => {
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument()
    })
    
    const viewDetailsButton = screen.getAllByText(/View Details/i)[0]
    fireEvent.click(viewDetailsButton)
    
    await waitFor(() => {
      expect(screen.getByText('A modern e-commerce solution')).toBeInTheDocument()
    })
    
    // Look for close button by text content or aria-label
    const closeButton = screen.getByText(/×|Close/i) || screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('A modern e-commerce solution')).not.toBeInTheDocument()
    })
  })

  test('handles API error gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'))
    
    render(<Projects />)
    
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })
  })
})
