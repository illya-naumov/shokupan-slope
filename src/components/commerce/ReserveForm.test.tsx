import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReserveForm } from './ReserveForm'

// Mock Lucide icons to avoid render issues
vi.mock('lucide-react', () => ({
    Calendar: () => <span data-testid="icon-calendar" />,
    ShoppingBag: () => <span data-testid="icon-shopping-bag" />,
    Truck: () => <span data-testid="icon-truck" />,
    ChevronRight: () => <span data-testid="icon-chevron-right" />,
    Minus: () => <span data-testid="icon-minus" />,
    Plus: () => <span data-testid="icon-plus" />,
    User: () => <span data-testid="icon-user" />,
    Mail: () => <span data-testid="icon-mail" />,
    Phone: () => <span data-testid="icon-phone" />,
    MessageSquare: () => <span data-testid="icon-message-square" />,
}))

// Mock Framer Motion to avoid async exit animations in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick }: any) => <div className={className} onClick={onClick}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock fetch for Google Script
global.fetch = vi.fn()

describe('ReserveForm', () => {
    it('renders correctly and starts at step 1', () => {
        render(<ReserveForm />)
        expect(screen.getByText('Build Your Order')).toBeInTheDocument()
        expect(screen.getByText('Classic Shokupan')).toBeInTheDocument()
    })

    it('calculates totals correctly when items are added', () => {
        render(<ReserveForm />)

        const addClassic = screen.getAllByTestId('icon-plus')[0].parentElement!
        const addSpecialty = screen.getAllByTestId('icon-plus')[1].parentElement!

        fireEvent.click(addClassic) // 1 Classic ($14)
        fireEvent.click(addSpecialty) // 1 Specialty ($18)

        // Total should be $32
        expect(screen.getByText('$32.00')).toBeInTheDocument()
    })

    it('enforces 3+ items for free delivery logic check', async () => {
        render(<ReserveForm />)

        // Get buttons (Classic is first row)
        const addClassic = screen.getAllByTestId('icon-plus')[0].parentElement!

        // Add 2 items (Under 3)
        fireEvent.click(addClassic)
        fireEvent.click(addClassic)

        // Go to Step 2
        fireEvent.click(screen.getByText('Next Step'))

        // Wait for animation/step change
        await waitFor(() => {
            expect(screen.getByText('How to get it')).toBeInTheDocument()
        })

        // Check Delivery text
        expect(screen.getByText('+$6.00')).toBeInTheDocument()
    })

    it('shows free delivery when 3+ items are selected', async () => {
        render(<ReserveForm />)

        const addClassic = screen.getAllByTestId('icon-plus')[0].parentElement!

        // Add 3 items
        fireEvent.click(addClassic)
        fireEvent.click(addClassic)
        fireEvent.click(addClassic)

        // Go to Step 2
        fireEvent.click(screen.getByText('Next Step'))

        // Wait for animation/step change
        await waitFor(() => {
            expect(screen.getByText('How to get it')).toBeInTheDocument()
        })

        // Check Delivery text
        expect(screen.getByText('Free (3+ items)')).toBeInTheDocument()
    })
})
