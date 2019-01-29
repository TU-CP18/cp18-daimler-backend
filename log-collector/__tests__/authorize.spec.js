const jwtSecret = require('jwt-simple');

const authorize = require('../src/authorize');
const JWT_SECRET = 'secret';
const JWT_ALGORITHM = 'HS512';

function createMockToken(secret, algorithm, payload, header = {}) {
    return jwtSecret.encode(payload, secret, algorithm, { header: { alg: algorithm, ...header } });
}

test('no token passed in header > return 401', () => {
    const middleware = authorize(JWT_SECRET, JWT_ALGORITHM);
    const mockRequest = { get: jest.fn().mockReturnValue('') };
    const mockResponse = { status: jest.fn().mockReturnValue({ end: jest.fn() }) };
    const mockNext = jest.fn();

    middleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
});

test('no token passed in header > return 401', () => {
    const middleware = authorize(JWT_SECRET, JWT_ALGORITHM);
    const mockRequest = { get: jest.fn().mockReturnValue('') };
    const mockResponse = { status: jest.fn().mockReturnValue({ end: jest.fn() }) };
    const mockNext = jest.fn();

    middleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
});

test('malformed token > return 401', () => {
    const middleware = authorize(JWT_SECRET, JWT_ALGORITHM);
    const mockRequest = { get: jest.fn().mockReturnValue('sdoifjwoifjwe') };
    const mockResponse = { status: jest.fn().mockReturnValue({ end: jest.fn() }) };
    const mockNext = jest.fn();

    middleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
});

test('not an admin or fleet manager > return 403', () => {
    const middleware = authorize(JWT_SECRET, JWT_ALGORITHM);
    const mockToken = createMockToken('secret', 'HS512', { sub: 'driver', exp: +new Date() + 1000 });
    const mockRequest = { get: jest.fn().mockReturnValue(mockToken) };
    const mockResponse = { status: jest.fn().mockReturnValue({ end: jest.fn() }) };
    const mockNext = jest.fn();

    middleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
});

test('token expired > return 401', () => {
    const middleware = authorize(JWT_SECRET, JWT_ALGORITHM);
    const mockToken = createMockToken('secret', 'HS512', { sub: 'fleetmanager', exp: +new Date() - 1000 });
    const mockRequest = { get: jest.fn().mockReturnValue(mockToken) };
    const mockResponse = { status: jest.fn().mockReturnValue({ end: jest.fn() }) };
    const mockNext = jest.fn();

    middleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
});

test('fleet manager and non-expired token > pass to next', () => {
    const middleware = authorize(JWT_SECRET, JWT_ALGORITHM);
    const mockToken = createMockToken('secret', 'HS512', { sub: 'fleetmanager', exp: +new Date() + 1000 });
    const mockRequest = { get: jest.fn().mockReturnValue(mockToken) };
    const mockResponse = { status: jest.fn().mockReturnValue({ end: jest.fn() }) };
    const mockNext = jest.fn();

    middleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
});
