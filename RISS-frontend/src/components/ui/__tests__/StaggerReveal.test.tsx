import { render, screen } from '@testing-library/react'
import { StaggerReveal } from '../StaggerReveal'

describe('StaggerReveal', () => {
  it('renders children', () => {
    render(
      <StaggerReveal>
        <div>Test Content</div>
      </StaggerReveal>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders multiple children with stagger', () => {
    render(
      <StaggerReveal>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </StaggerReveal>
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <StaggerReveal className="custom-class">
        <div>Test</div>
      </StaggerReveal>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

