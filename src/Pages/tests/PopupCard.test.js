import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopupOverlay from '../EventCreation/components/PopupCard';

describe('PopupOverlay', () => {
  test('renders popup with title and content', () => {
    render(
      <PopupOverlay title="Test Popup">
        <p>Test content</p>
      </PopupOverlay>
    );
    expect(screen.getByText('Test Popup')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('closes popup when title is clicked', () => {
    const onCloseMock = jest.fn();
    render(
      <PopupOverlay title="Test Popup" onClose={onCloseMock}>
        <p>Test content</p>
      </PopupOverlay>
    );
    fireEvent.click(screen.getByText('Test Popup'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('renders done button when notButton prop is true', () => {
    render(
      <PopupOverlay title="Test Popup" notButton={true}>
        <p>Test content</p>
      </PopupOverlay>
    );
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('does not render done button when notButton prop is false', () => {
    render(
      <PopupOverlay title="Test Popup" notButton={false}>
        <p>Test content</p>
      </PopupOverlay>
    );
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });

  test('calls onClose when done button is clicked', () => {
    const onCloseMock = jest.fn();
    render(
      <PopupOverlay title="Test Popup" onClose={onCloseMock} notButton={true}>
        <p>Test content</p>
      </PopupOverlay>
    );
    fireEvent.click(screen.getByText('Done'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('does not render popup after close', () => {
    const { rerender } = render(
      <PopupOverlay title="Test Popup">
        <p>Test content</p>
      </PopupOverlay>
    );
    fireEvent.click(screen.getByText('Test Popup'));
    rerender(
      <PopupOverlay title="Test Popup">
        <p>Test content</p>
      </PopupOverlay>
    );
    expect(screen.queryByText('Test Popup')).not.toBeInTheDocument();
  });
});
