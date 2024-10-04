import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopupOverlay from '../PopupCard';

describe('PopupOverlay', () => {
  test('renders popup with title and children', () => {
    render(
      <PopupOverlay title="Test Popup" onClose={() => {}}>
        <div>Test Content</div>
      </PopupOverlay>
    );
    expect(screen.getByText('Test Popup')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(
      <PopupOverlay title="Test Popup" onClose={onCloseMock}>
        <div>Test Content</div>
      </PopupOverlay>
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('renders done button when notButton prop is true', () => {
    render(
      <PopupOverlay title="Test Popup" onClose={() => {}} notButton={true}>
        <div>Test Content</div>
      </PopupOverlay>
    );
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('does not render done button when notButton prop is false', () => {
    render(
      <PopupOverlay title="Test Popup" onClose={() => {}} notButton={false}>
        <div>Test Content</div>
      </PopupOverlay>
    );
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });
});
