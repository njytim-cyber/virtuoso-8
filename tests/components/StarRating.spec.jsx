import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StarRating from '@components/StarRating';

describe('StarRating Component', () => {
    it('should render 5 stars', () => {
        const setRating = () => { };
        render(<StarRating rating={0} setRating={setRating} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(5);
    });

    it('should display "Rate your performance" when rating is 0', () => {
        const setRating = () => { };
        render(<StarRating rating={0} setRating={setRating} />);

        expect(screen.getByText('Rate your performance')).toBeInTheDocument();
    });

    it('should display "Perfect!" when rating is 5', () => {
        const setRating = () => { };
        render(<StarRating rating={5} setRating={setRating} />);

        expect(screen.getByText('Perfect!')).toBeInTheDocument();
    });

    it('should display "Very Good" when rating is 4', () => {
        const setRating = () => { };
        render(<StarRating rating={4} setRating={setRating} />);

        expect(screen.getByText('Very Good')).toBeInTheDocument();
    });

    it('should display "Passable" when rating is 3', () => {
        const setRating = () => { };
        render(<StarRating rating={3} setRating={setRating} />);

        expect(screen.getByText('Passable')).toBeInTheDocument();
    });

    it('should display "Needs Work" when rating is 2', () => {
        const setRating = () => { };
        render(<StarRating rating={2} setRating={setRating} />);

        expect(screen.getByText('Needs Work')).toBeInTheDocument();
    });

    it('should display "Try Again" when rating is 1', () => {
        const setRating = () => { };
        render(<StarRating rating={1} setRating={setRating} />);

        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should call setRating when star is clicked', async () => {
        let currentRating = 0;
        const setRating = (val) => { currentRating = val; };
        const user = userEvent.setup();

        const { rerender } = render(<StarRating rating={currentRating} setRating={setRating} />);

        const buttons = screen.getAllByRole('button');
        await user.click(buttons[2]); // Click 3rd star

        expect(currentRating).toBe(3);
    });

    it('should call onRate callback if provided', async () => {
        let ratedValue = null;
        const setRating = () => { };
        const onRate = (val) => { ratedValue = val; };
        const user = userEvent.setup();

        render(<StarRating rating={0} setRating={setRating} onRate={onRate} />);

        const buttons = screen.getAllByRole('button');
        await user.click(buttons[4]); // Click 5th star

        expect(ratedValue).toBe(5);
    });
});
