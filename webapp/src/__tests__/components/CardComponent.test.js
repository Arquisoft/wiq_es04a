import { render, fireEvent, screen } from '@testing-library/react';
import CardComponent from '../../components/CardComponent';

describe('CardComponent', () => {
    it('renders correctly with given props', () => {
        const { getByText, getByAltText } = render(<CardComponent imageUrl="test.jpg" title="Test Title" isActive={false} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByAltText('Test Title')).toHaveAttribute('src', 'test.jpg');
    });

    it('applies hovered styles on mouse enter', () => {
        const { getByText, container } = render(<CardComponent imageUrl="test.jpg" title="Test Title" isActive={false} />);
        const cardDiv = container.firstChild;
        fireEvent.mouseEnter(cardDiv);
        expect(cardDiv).toHaveStyle(`transform: scale(1.04) rotate(-1deg)`);
        expect(screen.getByText('Test Title').parentNode).toHaveStyle('opacity: 1');
    });

    it('removes hovered styles on mouse leave', () => {
        const { getByText, container } = render(<CardComponent imageUrl="test.jpg" title="Test Title" isActive={false} />);
        const cardDiv = container.firstChild;
        fireEvent.mouseEnter(cardDiv);
        fireEvent.mouseLeave(cardDiv);
        expect(cardDiv).toHaveStyle(`transform: scale(1) rotate(0deg)`);
        expect(screen.getByText('Test Title').parentNode).toHaveStyle('opacity: 0');
    });

    it('maintains hovered styles when isActive is true', () => {
        const { getByText, container } = render(<CardComponent imageUrl="test.jpg" title="Test Title" isActive={true} />);
        const cardDiv = container.firstChild;
        fireEvent.mouseEnter(cardDiv);
        fireEvent.mouseLeave(cardDiv);
        expect(cardDiv).toHaveStyle(`transform: scale(1.04) rotate(-1deg)`);
        expect(screen.getByText('Test Title').parentNode).toHaveStyle('opacity: 1');
    });
});
