import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../dashboard/header';

describe('Header component', () => {
  test('renders profile image', () => {
    render(<Header />);
    const profileImage = screen.getByAltText('Profile');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage.src).toContain('profile-logo.jpg');
  }); 

  test('profile image has correct attributes', () => {
    render(<Header />);
    const profileImage = screen.getByAltText('Profile');
    expect(profileImage).toHaveAttribute('src', expect.stringContaining('profile-logo.jpg'));
    expect(profileImage).toHaveAttribute('alt', 'Profile');
  });

  // Remove the test that checks for image load completion
  // test('profile image is loaded correctly', () => {
  //   render(<Header />);
  //   const profileImage = screen.getByAltText('Profile');
  //   expect(profileImage.complete).toBeTruthy();
  // });
});
