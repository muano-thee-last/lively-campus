import createNewUser from './createNewUser';

// Mock sessionStorage
const mockSessionStorage = {};
Object.defineProperty(window, 'sessionStorage', {
  value: {
    setItem: jest.fn((key, value) => {
      mockSessionStorage[key] = value;
    }),
    getItem: jest.fn((key) => mockSessionStorage[key]),
    clear: jest.fn(() => {
      for (const key in mockSessionStorage) {
        delete mockSessionStorage[key];
      }
    }),
  },
  writable: true,
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Mock alert and prompt
global.alert = jest.fn();
global.prompt = jest.fn();

describe('createNewUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key in mockSessionStorage) {
      delete mockSessionStorage[key];
    }
  });

  test('creates a new user with all information provided', async () => {
    const mockResult = {
      user: {
        uid: '123',
        displayName: 'John Doe',
        email: 'john@example.com',
        photoURL: 'https://example.com/photo.jpg',
      },
    };

    await createNewUser(mockResult);

    expect(sessionStorage.setItem).toHaveBeenCalledWith('uid', '123');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResult.user));

    expect(global.fetch).toHaveBeenCalledWith(
      'https://us-central1-witslivelycampus.cloudfunctions.net/app/users',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId1: '123',
          name: 'John Doe',
          email: 'john@example.com',
          commentedEvents: [],
          likedEvents: [],
          profile_picture: 'https://example.com/photo.jpg',
        }),
      })
    );

    expect(global.alert).toHaveBeenCalledWith('Account successfully created');
  });

  test('prompts for name if not provided', async () => {
    const mockResult = {
      user: {
        uid: '123',
        displayName: null,
        email: 'john@example.com',
        photoURL: 'https://example.com/photo.jpg',
      },
    };

    global.prompt.mockReturnValueOnce('John Doe');

    await createNewUser(mockResult);

    expect(global.prompt).toHaveBeenCalledWith('Please enter your name:');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://us-central1-witslivelycampus.cloudfunctions.net/app/users',
      expect.objectContaining({
        body: expect.stringContaining('"name":"John Doe"'),
      })
    );
  });

  test('alerts and returns if name is not provided when prompted', async () => {
    const mockResult = {
      user: {
        uid: '123',
        displayName: null,
        email: 'john@example.com',
        photoURL: 'https://example.com/photo.jpg',
      },
    };

    global.prompt.mockReturnValueOnce(null);

    await createNewUser(mockResult);

    expect(global.prompt).toHaveBeenCalledWith('Please enter your name:');
    expect(global.alert).toHaveBeenCalledWith('First name is required!');
    expect(global.fetch).not.toHaveBeenCalled();
  });

});